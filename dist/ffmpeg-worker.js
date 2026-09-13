let ffmpeg;

const respond = (id, type, data, transfer = []) => postMessage({ id, type, data }, transfer);

const load = async ({ coreURL, wasmURL }) => {
  importScripts(coreURL);
  ffmpeg = await self.createFFmpegCore({
    mainScriptUrlOrBlob: `${coreURL}#${btoa(JSON.stringify({ wasmURL }))}`,
  });
  ffmpeg.setProgress((data) => respond(undefined, "PROGRESS", data));
};

self.onmessage = async ({ data: { id, type, data } }) => {
  try {
    if (type !== "LOAD" && !ffmpeg) throw new Error("ตัวเข้ารหัสยังไม่พร้อม");
    switch (type) {
      case "LOAD":
        await load(data);
        respond(id, type, true);
        break;
      case "WRITE_FILE":
        ffmpeg.FS.writeFile(data.path, data.data);
        respond(id, type, true);
        break;
      case "EXEC":
        ffmpeg.setTimeout(-1);
        ffmpeg.exec("-nostdin", "-y", ...data.args);
        if (ffmpeg.ret !== 0) throw new Error(`FFmpeg exited with code ${ffmpeg.ret}`);
        ffmpeg.reset();
        respond(id, type, true);
        break;
      case "READ_FILE": {
        const bytes = ffmpeg.FS.readFile(data.path);
        respond(id, type, bytes, [bytes.buffer]);
        break;
      }
      case "DELETE_FILE":
        ffmpeg.FS.unlink(data.path);
        respond(id, type, true);
        break;
      default:
        throw new Error("Unknown operation");
    }
  } catch (error) {
    respond(id, "ERROR", error instanceof Error ? error.message : String(error));
  }
};
