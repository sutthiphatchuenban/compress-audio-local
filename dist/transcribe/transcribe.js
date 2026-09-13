const MAX_FILE_BYTES = 4 * 1024 * 1024;
const t = (key, values) => window.AudioI18n.t(key, values);
const fileInput = document.querySelector('#transcribe-file');
const dropZone = document.querySelector('#transcribe-drop-zone');
const fileCard = document.querySelector('#transcribe-file-card');
const fileName = document.querySelector('#transcribe-file-name');
const fileSize = document.querySelector('#transcribe-file-size');
const clearButton = document.querySelector('#clear-transcribe-file');
const transcribeButton = document.querySelector('#transcribe-button');
const statusPanel = document.querySelector('#transcribe-status');
const statusText = document.querySelector('#transcribe-status-text');
const statusPercent = document.querySelector('#transcribe-status-percent');
const progressBar = document.querySelector('#transcribe-progress-bar');
const statusNote = document.querySelector('#transcribe-status-note');
const result = document.querySelector('#transcript-result');
const transcriptText = document.querySelector('#transcript-text');
const errorMessage = document.querySelector('#transcribe-error');
const copyButton = document.querySelector('#copy-transcript');
const downloadButton = document.querySelector('#download-transcript');
let selectedFile = null;
const transcribeEndpoints = window.location.hostname.includes('netlify')
  ? ['/.netlify/functions/transcribe', '/api/transcribe']
  : ['/api/transcribe', '/.netlify/functions/transcribe'];

function setProgress(value, message) { const percent = Math.max(0, Math.min(100, Math.round(value))); progressBar.style.width = `${percent}%`; progressBar.setAttribute('aria-valuenow', String(percent)); statusPercent.textContent = `${percent}%`; if (message) statusText.textContent = message; }
function formatBytes(bytes) { return `${(bytes / 1024 / 1024).toFixed(bytes < 1024 * 1024 ? 2 : 1)} MB`; }
function showError(message) { errorMessage.textContent = message; errorMessage.hidden = false; }
function clearError() { errorMessage.hidden = true; errorMessage.textContent = ''; }
function resetFile() { selectedFile = null; fileInput.value = ''; fileCard.hidden = true; transcribeButton.disabled = true; result.hidden = true; clearError(); }
function selectFile(file) {
  clearError(); result.hidden = true;
  if (!file) return;
  if (file.size === 0) { resetFile(); showError(t('transcribe.emptyFile')); return; }
  if (file.size > MAX_FILE_BYTES) { resetFile(); showError(t('transcribe.tooLarge', { size: formatBytes(file.size) })); return; }
  selectedFile = file; fileName.textContent = file.name; fileSize.textContent = `${formatBytes(file.size)} · ${t('transcribe.ready')}`; fileCard.hidden = false; transcribeButton.disabled = false;
}
fileInput.addEventListener('change', () => selectFile(fileInput.files[0]));
clearButton.addEventListener('click', resetFile);
['dragenter', 'dragover'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.add('dragging'); }));
['dragleave', 'drop'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.remove('dragging'); }));
dropZone.addEventListener('drop', (event) => selectFile(event.dataTransfer.files[0]));
transcribeButton.addEventListener('click', async () => {
  if (!selectedFile) return;
  clearError(); result.hidden = true; statusPanel.hidden = false; setProgress(8, t('transcribe.statusSending')); statusNote.textContent = t('transcribe.statusNote'); transcribeButton.disabled = true;
  let progress = 8;
  const progressTimer = window.setInterval(() => { progress = Math.min(90, progress + (progress < 40 ? 8 : 3)); setProgress(progress, progress < 40 ? t('transcribe.statusSendingAi') : t('transcribe.statusAi')); }, 900);
  try {
    const data = new FormData(); data.append('audio', selectedFile, selectedFile.name);
    let response;
    for (const endpoint of transcribeEndpoints) {
      response = await fetch(endpoint, { method: 'POST', body: data });
      if (response.status !== 404) break;
    }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || t('transcribe.unavailable'));
    if (!payload.text) throw new Error(t('transcribe.noText'));
    window.clearInterval(progressTimer); setProgress(100, t('transcribe.statusDone')); transcriptText.textContent = payload.text.trim(); result.hidden = false; result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) { showError(error.message || t('transcribe.genericError'));
  } finally { window.clearInterval(progressTimer); statusPanel.hidden = true; transcribeButton.disabled = !selectedFile; }
});
copyButton.addEventListener('click', async () => {
  const originalLabel = copyButton.textContent;
  try { await navigator.clipboard.writeText(transcriptText.textContent); copyButton.textContent = t('transcribe.copied'); }
  catch { showError(t('transcribe.copyError')); }
  window.setTimeout(() => { copyButton.textContent = originalLabel; }, 1800);
});
downloadButton.addEventListener('click', () => {
  const markdown = `# ${t('transcribe.markdownTitle', { name: selectedFile?.name || 'audio' })}\n\n${transcriptText.textContent.trim()}\n`;
  const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `${(selectedFile?.name || 'transcript').replace(/\.[^.]+$/, '')}-transcript.md`; link.click(); URL.revokeObjectURL(url);
});

window.addEventListener('audio-tools-language-change', () => {
  if (selectedFile) fileSize.textContent = `${formatBytes(selectedFile.size)} · ${t('transcribe.ready')}`;
});
