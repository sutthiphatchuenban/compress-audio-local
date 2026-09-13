const CORE_URL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";
const t = (key, values) => window.AudioI18n.t(key, values);
const elements = {
  input: document.querySelector("#audio-file"),
  dropZone: document.querySelector("#drop-zone"),
  fileCard: document.querySelector("#file-card"),
  fileName: document.querySelector("#file-name"),
  fileSize: document.querySelector("#file-size"),
  clear: document.querySelector("#clear-file"),
  bitrate: document.querySelector("#bitrate"),
  compress: document.querySelector("#compress-button"),
  statusPanel: document.querySelector("#status-panel"),
  statusText: document.querySelector("#status-text"),
  statusPercent: document.querySelector("#status-percent"),
  progressBar: document.querySelector("#progress-bar"),
  statusNote: document.querySelector("#status-note"),
  result: document.querySelector("#result-card"),
  resultSummary: document.querySelector("#result-summary"),
  download: document.querySelector("#download-link"),
  error: document.querySelector("#error-message"),
};

let selectedFile = null;
let ffmpeg = null;
let compressorReady = false;
let resultUrl = null;
let lastOutputBytes = 0;
let lastReduction = 0;

const toBlobURL = async (url, mimeType) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Cannot load ${url}`);
  const buffer = await response.arrayBuffer();
  return URL.createObjectURL(new Blob([buffer], { type: mimeType }));
};

class FFmpegClient {
  constructor() {
    this.worker = null;
    this.messageId = 0;
    this.pending = new Map();
    this.progressListener = null;
  }

  on(event, callback) {
    if (event === "progress") this.progressListener = callback;
  }

  async load(config) {
    if (!this.worker) {
      this.worker = new Worker("./ffmpeg-worker.js");
      this.worker.onmessage = ({ data }) => {
        if (data.type === "PROGRESS") {
          this.progressListener?.(data.data);
          return;
        }
        const request = this.pending.get(data.id);
        if (!request) return;
        this.pending.delete(data.id);
        if (data.type === "ERROR") request.reject(new Error(data.data));
        else request.resolve(data.data);
      };
      this.worker.onerror = (event) => {
        this.pending.forEach(({ reject }) => reject(event.error || new Error(event.message)));
        this.pending.clear();
      };
    }
    return this.#send("LOAD", config);
  }

  #send(type, data, transfer = []) {
    return new Promise((resolve, reject) => {
      const id = this.messageId++;
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage({ id, type, data }, transfer);
    });
  }

  writeFile(path, data) {
    return this.#send("WRITE_FILE", { path, data }, [data.buffer]);
  }

  exec(args) {
    return this.#send("EXEC", { args });
  }

  readFile(path) {
    return this.#send("READ_FILE", { path });
  }

  deleteFile(path) {
    return this.#send("DELETE_FILE", { path });
  }
}

const formatBytes = (bytes) => {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const setProgress = (value, text) => {
  const percent = Math.max(0, Math.min(100, Math.round(value * 100)));
  elements.progressBar.style.width = `${percent}%`;
  elements.statusPercent.textContent = `${percent}%`;
  if (text) elements.statusText.textContent = text;
};

const showError = (message = "") => {
  elements.error.hidden = !message;
  elements.error.textContent = message;
};

const resetResult = () => {
  if (resultUrl) URL.revokeObjectURL(resultUrl);
  resultUrl = null;
  lastOutputBytes = 0;
  lastReduction = 0;
  elements.result.hidden = true;
};

const setFile = (file) => {
  if (!file) return;
  if (!file.type.startsWith("audio/") && !/\.(m4a|mp3|wav|aac|ogg)$/i.test(file.name)) {
    showError(t("common.selectAudioError"));
    return;
  }
  selectedFile = file;
  elements.fileName.textContent = file.name;
  elements.fileSize.textContent = formatBytes(file.size);
  elements.fileCard.hidden = false;
  elements.compress.disabled = false;
  showError();
  resetResult();
};

const clearFile = () => {
  selectedFile = null;
  elements.input.value = "";
  elements.fileCard.hidden = true;
  elements.compress.disabled = true;
  elements.statusPanel.hidden = true;
  showError();
  resetResult();
};

const loadCompressor = async () => {
  if (compressorReady) return;
  ffmpeg = new FFmpegClient();
  ffmpeg.on("progress", ({ progress }) => setProgress(progress, t("compressor.compressing")));
  await ffmpeg.load({
    coreURL: await toBlobURL(`${CORE_URL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${CORE_URL}/ffmpeg-core.wasm`, "application/wasm"),
  });
  compressorReady = true;
};

const compressedName = (name) => {
  const stem = name.replace(/\.[^/.]+$/, "") || "audio";
  return `${stem}-compressed.m4a`;
};

const compressAudio = async () => {
  if (!selectedFile) return;
  elements.compress.disabled = true;
  elements.statusPanel.hidden = false;
  elements.result.hidden = true;
  showError();
  setProgress(0, compressorReady ? t("common.preparing") : t("compressor.loadingEncoder"));
  elements.statusNote.textContent = compressorReady ? t("common.browserProcessingNote") : t("common.firstLoadNote");

  const inputName = `input-${Date.now()}.${selectedFile.name.split(".").pop() || "m4a"}`;
  const outputName = compressedName(selectedFile.name);
  try {
    await loadCompressor();
    setProgress(0, t("compressor.reading"));
    await ffmpeg.writeFile(inputName, new Uint8Array(await selectedFile.arrayBuffer()));
    await ffmpeg.exec([
      "-i", inputName,
      "-vn",
      "-ac", "1",
      "-ar", "16000",
      "-c:a", "aac",
      "-b:a", `${elements.bitrate.value}k`,
      "-movflags", "+faststart",
      outputName,
    ]);
    const data = await ffmpeg.readFile(outputName);
    resultUrl = URL.createObjectURL(new Blob([data], { type: "audio/mp4" }));
    elements.download.href = resultUrl;
    elements.download.download = outputName;
    const reduction = Math.max(0, Math.round((1 - data.byteLength / selectedFile.size) * 100));
    lastOutputBytes = data.byteLength;
    lastReduction = reduction;
    elements.resultSummary.textContent = t("compressor.resultSummary", { input: formatBytes(selectedFile.size), output: formatBytes(data.byteLength), reduction });
    elements.statusPanel.hidden = true;
    elements.result.hidden = false;
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
  } catch (error) {
    console.error(error);
    elements.statusPanel.hidden = true;
    showError(t("compressor.error"));
  } finally {
    elements.compress.disabled = false;
  }
};

elements.input.addEventListener("change", (event) => setFile(event.target.files?.[0]));
elements.clear.addEventListener("click", clearFile);
elements.compress.addEventListener("click", compressAudio);
["dragenter", "dragover"].forEach((eventName) => elements.dropZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  elements.dropZone.classList.add("dragging");
}));
["dragleave", "drop"].forEach((eventName) => elements.dropZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  elements.dropZone.classList.remove("dragging");
}));
elements.dropZone.addEventListener("drop", (event) => setFile(event.dataTransfer.files?.[0]));

window.addEventListener("audio-tools-language-change", () => {
  if (!elements.result.hidden && selectedFile && lastOutputBytes) {
    elements.resultSummary.textContent = t("compressor.resultSummary", { input: formatBytes(selectedFile.size), output: formatBytes(lastOutputBytes), reduction: lastReduction });
  }
});

if (document.modelContext?.registerTool) {
  void Promise.resolve(document.modelContext.registerTool({
    name: "stage_audio_compression",
    title: t("compressor.compressButton"),
    description: t("compressor.heroIntro"),
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: true },
    execute: () => {
      elements.input.click();
      return { status: "file_picker_opened" };
    },
  })).catch(() => {});
}
