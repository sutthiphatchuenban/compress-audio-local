const CORE_URL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd';
const elements = {
  input: document.querySelector('#split-file'), dropZone: document.querySelector('#split-drop-zone'), fileCard: document.querySelector('#split-file-card'), fileName: document.querySelector('#split-file-name'), fileInfo: document.querySelector('#split-file-info'), clear: document.querySelector('#clear-split-file'), settings: document.querySelector('#split-settings'), parts: document.querySelector('#parts-count'), estimate: document.querySelector('#split-estimate'), split: document.querySelector('#split-button'), status: document.querySelector('#split-status'), statusText: document.querySelector('#split-status-text'), statusPercent: document.querySelector('#split-status-percent'), progress: document.querySelector('#split-progress-bar'), statusNote: document.querySelector('#split-status-note'), results: document.querySelector('#split-results'), resultsTitle: document.querySelector('#split-results-title'), resultsList: document.querySelector('#split-results-list'), downloadAll: document.querySelector('#download-all-splits'), clearResults: document.querySelector('#clear-split-results'), error: document.querySelector('#split-error'),
};
let selectedFile = null;
let duration = 0;
let ffmpeg = null;
let workerReady = false;
let resultUrls = [];
let resultFiles = [];

const formatBytes = (bytes) => bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const formatDuration = (seconds) => `${Math.floor(seconds / 60)} นาที ${Math.round(seconds % 60)} วินาที`;
const toBlobURL = async (url, type) => { const response = await fetch(url); if (!response.ok) throw new Error(`Cannot load ${url}`); return URL.createObjectURL(new Blob([await response.arrayBuffer()], { type })); };
function showError(message = '') { elements.error.hidden = !message; elements.error.textContent = message; }
function setProgress(value, message) { const percent = Math.max(0, Math.min(100, Math.round(value * 100))); elements.progress.style.width = `${percent}%`; elements.statusPercent.textContent = `${percent}%`; if (message) elements.statusText.textContent = message; }
function clearResults() { resultUrls.forEach((url) => URL.revokeObjectURL(url)); resultUrls = []; resultFiles = []; elements.results.hidden = true; elements.resultsList.replaceChildren(); }
function audioDuration(file) { return new Promise((resolve, reject) => { const audio = document.createElement('audio'); const url = URL.createObjectURL(file); audio.preload = 'metadata'; audio.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(audio.duration); }; audio.onerror = () => { URL.revokeObjectURL(url); reject(new Error('ไม่สามารถอ่านความยาวไฟล์นี้ได้')); }; audio.src = url; }); }
class FFmpegClient {
  constructor() { this.worker = null; this.messageId = 0; this.pending = new Map(); this.progressListener = null; }
  on(event, callback) { if (event === 'progress') this.progressListener = callback; }
  async load(config) { if (!this.worker) { this.worker = new Worker('../ffmpeg-worker.js'); this.worker.onmessage = ({ data }) => { if (data.type === 'PROGRESS') { this.progressListener?.(data.data); return; } const pending = this.pending.get(data.id); if (!pending) return; this.pending.delete(data.id); data.type === 'ERROR' ? pending.reject(new Error(data.data)) : pending.resolve(data.data); }; this.worker.onerror = (event) => { this.pending.forEach(({ reject }) => reject(event.error || new Error(event.message))); this.pending.clear(); }; } return this.send('LOAD', config); }
  send(type, data, transfer = []) { return new Promise((resolve, reject) => { const id = this.messageId++; this.pending.set(id, { resolve, reject }); this.worker.postMessage({ id, type, data }, transfer); }); }
  writeFile(path, data) { return this.send('WRITE_FILE', { path, data }, [data.buffer]); }
  exec(args) { return this.send('EXEC', { args }); }
  readFile(path) { return this.send('READ_FILE', { path }); }
  deleteFile(path) { return this.send('DELETE_FILE', { path }); }
}
async function loadWorker() { if (workerReady) return; ffmpeg = new FFmpegClient(); await ffmpeg.load({ coreURL: await toBlobURL(`${CORE_URL}/ffmpeg-core.js`, 'text/javascript'), wasmURL: await toBlobURL(`${CORE_URL}/ffmpeg-core.wasm`, 'application/wasm') }); workerReady = true; }
function updateEstimate() { if (!selectedFile || !duration) return; const count = Math.max(2, Math.min(50, Number(elements.parts.value) || 2)); elements.parts.value = count; const eachDuration = duration / count; const eachBytes = selectedFile.size / count; elements.estimate.textContent = `ไฟล์ละประมาณ ${formatDuration(eachDuration)} · ${formatBytes(eachBytes)} (อิงจากขนาดไฟล์เดิม)`; }
async function setFile(file) {
  clearResults(); showError();
  if (!file) return;
  if (!file.type.startsWith('audio/') && !/\.(m4a|mp3|wav|aac|ogg|webm)$/i.test(file.name)) { showError('กรุณาเลือกไฟล์เสียง เช่น M4A, MP3, WAV, AAC, OGG หรือ WebM'); return; }
  selectedFile = file; duration = 0; elements.fileName.textContent = file.name; elements.fileInfo.textContent = `${formatBytes(file.size)} · กำลังอ่านความยาวไฟล์…`; elements.fileCard.hidden = false; elements.settings.hidden = false; elements.split.disabled = true; elements.estimate.textContent = 'กำลังอ่านความยาวไฟล์…';
  try { duration = await audioDuration(file); if (!Number.isFinite(duration) || duration <= 0) throw new Error(); elements.fileInfo.textContent = `${formatBytes(file.size)} · ${formatDuration(duration)}`; updateEstimate(); elements.split.disabled = false; } catch { showError('ไม่สามารถอ่านความยาวไฟล์นี้ได้ ลองใช้ M4A, MP3 หรือ WAV'); }
}
function resetFile() { selectedFile = null; duration = 0; elements.input.value = ''; elements.fileCard.hidden = true; elements.settings.hidden = true; elements.status.hidden = true; elements.split.disabled = true; showError(); clearResults(); }
function extensionFor(file) { const extension = file.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase(); return /^(m4a|mp3|wav|aac|ogg|webm)$/.test(extension) ? extension : 'm4a'; }
function addResult(name, data, index) { const blob = new Blob([data], { type: selectedFile.type || 'audio/*' }); const url = URL.createObjectURL(blob); resultUrls.push(url); resultFiles.push({ name, blob }); const link = document.createElement('a'); link.className = 'split-download'; link.href = url; link.download = name; link.innerHTML = `<span><b>ส่วน ${index}</b><small>${formatBytes(data.byteLength)}</small></span><em>ดาวน์โหลด ↓</em>`; elements.resultsList.append(link); }

const crcTable = (() => { const table = new Uint32Array(256); for (let index = 0; index < 256; index += 1) { let value = index; for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? (value >>> 1) ^ 0xedb88320 : value >>> 1; table[index] = value >>> 0; } return table; })();
function crc32(bytes) { let value = 0xffffffff; for (const byte of bytes) value = (value >>> 8) ^ crcTable[(value ^ byte) & 0xff]; return (value ^ 0xffffffff) >>> 0; }
function write16(bytes, offset, value) { bytes[offset] = value & 0xff; bytes[offset + 1] = (value >>> 8) & 0xff; }
function write32(bytes, offset, value) { bytes[offset] = value & 0xff; bytes[offset + 1] = (value >>> 8) & 0xff; bytes[offset + 2] = (value >>> 16) & 0xff; bytes[offset + 3] = (value >>> 24) & 0xff; }
async function makeZip(entries) {
  const encoder = new TextEncoder(); const locals = []; const central = []; let offset = 0;
  for (const entry of entries) {
    const name = encoder.encode(entry.name); const data = new Uint8Array(await entry.blob.arrayBuffer()); const checksum = crc32(data); const local = new Uint8Array(30 + name.length + data.length);
    write32(local, 0, 0x04034b50); write16(local, 4, 20); write16(local, 6, 0x0800); write16(local, 8, 0); write32(local, 14, checksum); write32(local, 18, data.length); write32(local, 22, data.length); write16(local, 26, name.length); local.set(name, 30); local.set(data, 30 + name.length); locals.push(local);
    const directory = new Uint8Array(46 + name.length); write32(directory, 0, 0x02014b50); write16(directory, 4, 20); write16(directory, 6, 20); write16(directory, 8, 0x0800); write16(directory, 10, 0); write32(directory, 16, checksum); write32(directory, 20, data.length); write32(directory, 24, data.length); write16(directory, 28, name.length); write32(directory, 42, offset); directory.set(name, 46); central.push(directory); offset += local.length;
  }
  const centralSize = central.reduce((total, part) => total + part.length, 0); const end = new Uint8Array(22); write32(end, 0, 0x06054b50); write16(end, 8, entries.length); write16(end, 10, entries.length); write32(end, 12, centralSize); write32(end, 16, offset); return new Blob([...locals, ...central, end], { type: 'application/zip' });
}
async function downloadAllSplits() {
  if (!resultFiles.length) return;
  const originalLabel = elements.downloadAll.textContent; elements.downloadAll.disabled = true; elements.downloadAll.textContent = 'กำลังแพ็ก .zip…';
  try { const archive = await makeZip(resultFiles); const url = URL.createObjectURL(archive); const link = document.createElement('a'); link.href = url; link.download = `${(selectedFile?.name || 'audio').replace(/\.[^/.]+$/, '')}-split.zip`; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
  catch (error) { console.error(error); showError('สร้าง ZIP ไม่สำเร็จ ลองดาวน์โหลดแยกทีละไฟล์ หรือปิดแอปอื่นเพื่อเพิ่มหน่วยความจำ'); }
  finally { elements.downloadAll.disabled = false; elements.downloadAll.textContent = originalLabel; }
}
async function splitAudio() {
  if (!selectedFile || !duration) return;
  const count = Math.max(2, Math.min(50, Number(elements.parts.value) || 2)); const segmentDuration = duration / count; const extension = extensionFor(selectedFile); const inputName = `input-${Date.now()}.${extension}`; const stem = selectedFile.name.replace(/\.[^/.]+$/, '') || 'audio';
  elements.split.disabled = true; elements.status.hidden = false; clearResults(); showError(); setProgress(0, workerReady ? 'กำลังเตรียมไฟล์…' : 'กำลังโหลดตัวประมวลผลครั้งแรก…'); elements.statusNote.textContent = 'ไฟล์ถูกประมวลผลในเบราว์เซอร์ ไม่ได้อัปโหลดไปที่ใด';
  try {
    await loadWorker(); await ffmpeg.writeFile(inputName, new Uint8Array(await selectedFile.arrayBuffer()));
    for (let index = 0; index < count; index += 1) {
      const outputName = `${stem}-part-${String(index + 1).padStart(2, '0')}.${extension}`; const start = (index * segmentDuration).toFixed(3); const length = Math.min(segmentDuration, duration - index * segmentDuration).toFixed(3);
      setProgress(index / count, `กำลังแบ่งส่วนที่ ${index + 1} จาก ${count}…`);
      await ffmpeg.exec(['-ss', start, '-t', length, '-i', inputName, '-vn', '-c', 'copy', outputName]);
      const data = await ffmpeg.readFile(outputName); addResult(outputName, data, index + 1); await ffmpeg.deleteFile(outputName);
    }
    await ffmpeg.deleteFile(inputName); setProgress(1, 'แบ่งไฟล์เสร็จแล้ว'); elements.resultsTitle.textContent = `ไฟล์ที่แบ่งแล้ว ${count} ส่วน`; elements.results.hidden = false;
  } catch (error) { console.error(error); showError('แบ่งไฟล์ไม่สำเร็จ ลองใช้ M4A, MP3 หรือ WAV และตรวจสอบว่าหน่วยความจำในเครื่องเพียงพอ'); try { await ffmpeg?.deleteFile(inputName); } catch {} }
  finally { elements.status.hidden = true; elements.split.disabled = !selectedFile || !duration; }
}
elements.input.addEventListener('change', (event) => setFile(event.target.files?.[0])); elements.clear.addEventListener('click', resetFile); elements.parts.addEventListener('input', updateEstimate); elements.split.addEventListener('click', splitAudio); elements.downloadAll.addEventListener('click', downloadAllSplits); elements.clearResults.addEventListener('click', clearResults);
['dragenter', 'dragover'].forEach((eventName) => elements.dropZone.addEventListener(eventName, (event) => { event.preventDefault(); elements.dropZone.classList.add('dragging'); }));
['dragleave', 'drop'].forEach((eventName) => elements.dropZone.addEventListener(eventName, (event) => { event.preventDefault(); elements.dropZone.classList.remove('dragging'); }));
elements.dropZone.addEventListener('drop', (event) => setFile(event.dataTransfer.files?.[0]));
