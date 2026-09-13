const MAX_FILE_BYTES = 4 * 1024 * 1024;
const fileInput = document.querySelector('#transcribe-file');
const dropZone = document.querySelector('#transcribe-drop-zone');
const fileCard = document.querySelector('#transcribe-file-card');
const fileName = document.querySelector('#transcribe-file-name');
const fileSize = document.querySelector('#transcribe-file-size');
const clearButton = document.querySelector('#clear-transcribe-file');
const transcribeButton = document.querySelector('#transcribe-button');
const statusPanel = document.querySelector('#transcribe-status');
const statusText = document.querySelector('#transcribe-status-text');
const statusNote = document.querySelector('#transcribe-status-note');
const result = document.querySelector('#transcript-result');
const transcriptText = document.querySelector('#transcript-text');
const errorMessage = document.querySelector('#transcribe-error');
const copyButton = document.querySelector('#copy-transcript');
const downloadButton = document.querySelector('#download-transcript');
let selectedFile = null;

function formatBytes(bytes) { return `${(bytes / 1024 / 1024).toFixed(bytes < 1024 * 1024 ? 2 : 1)} MB`; }
function showError(message) { errorMessage.textContent = message; errorMessage.hidden = false; }
function clearError() { errorMessage.hidden = true; errorMessage.textContent = ''; }
function resetFile() { selectedFile = null; fileInput.value = ''; fileCard.hidden = true; transcribeButton.disabled = true; result.hidden = true; clearError(); }
function selectFile(file) {
  clearError(); result.hidden = true;
  if (!file) return;
  if (file.size === 0) { resetFile(); showError('ไฟล์นี้ว่างเปล่า กรุณาเลือกไฟล์เสียงอื่น'); return; }
  if (file.size > MAX_FILE_BYTES) { resetFile(); showError(`ไฟล์ ${formatBytes(file.size)} ใหญ่เกินขีดจำกัด 4 MB กรุณาบีบอัดหรือตัดไฟล์ให้เล็กลงก่อน`); return; }
  selectedFile = file; fileName.textContent = file.name; fileSize.textContent = `${formatBytes(file.size)} · พร้อมถอดเสียง`; fileCard.hidden = false; transcribeButton.disabled = false;
}
fileInput.addEventListener('change', () => selectFile(fileInput.files[0]));
clearButton.addEventListener('click', resetFile);
['dragenter', 'dragover'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.add('dragging'); }));
['dragleave', 'drop'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.remove('dragging'); }));
dropZone.addEventListener('drop', (event) => selectFile(event.dataTransfer.files[0]));
transcribeButton.addEventListener('click', async () => {
  if (!selectedFile) return;
  clearError(); result.hidden = true; statusPanel.hidden = false; statusText.textContent = 'กำลังส่งไฟล์เพื่อถอดเสียง…'; statusNote.textContent = 'อย่าปิดหน้านี้จนกว่าจะได้ผลลัพธ์'; transcribeButton.disabled = true;
  try {
    const data = new FormData(); data.append('audio', selectedFile, selectedFile.name);
    const response = await fetch('/.netlify/functions/transcribe', { method: 'POST', body: data });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'ไม่สามารถถอดเสียงได้ในขณะนี้');
    if (!payload.text) throw new Error('ไม่ได้รับข้อความถอดเสียงจากบริการ');
    transcriptText.textContent = payload.text.trim(); result.hidden = false; result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) { showError(error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
  } finally { statusPanel.hidden = true; transcribeButton.disabled = !selectedFile; }
});
copyButton.addEventListener('click', async () => {
  const originalLabel = copyButton.textContent;
  try { await navigator.clipboard.writeText(transcriptText.textContent); copyButton.textContent = 'คัดลอกแล้ว'; }
  catch { showError('คัดลอกไม่สำเร็จ กรุณาเลือกข้อความจากกล่องผลลัพธ์เอง'); }
  window.setTimeout(() => { copyButton.textContent = originalLabel; }, 1800);
});
downloadButton.addEventListener('click', () => {
  const markdown = `# ถอดเสียง: ${selectedFile?.name || 'audio'}\n\n${transcriptText.textContent.trim()}\n`;
  const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `${(selectedFile?.name || 'transcript').replace(/\.[^.]+$/, '')}-transcript.md`; link.click(); URL.revokeObjectURL(url);
});
