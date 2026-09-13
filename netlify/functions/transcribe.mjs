const MAX_FILE_BYTES = 4 * 1024 * 1024;
const ALLOWED_AUDIO_PREFIX = 'audio/';
function json(body, status = 200) { return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } }); }
function getTranscript(payload) {
  if (payload?.text || payload?.outputText || payload?.output_text) return (payload.text || payload.outputText || payload.output_text).trim();
  return (payload?.candidates || []).flatMap((candidate) => candidate.content?.parts || []).map((part) => {
    if (part.text) return part.text;
    const words = part.audioTranscription?.words || [];
    return words.map((word) => word.word || '').join(' ');
  }).join('').trim();
}
function mimeTypeFor(audio) {
  const extension = audio.name?.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
  const byExtension = { m4a: 'audio/m4a', mp3: 'audio/mpeg', wav: 'audio/wav', aac: 'audio/aac', ogg: 'audio/ogg', webm: 'audio/webm' };
  return byExtension[extension] || audio.type;
}
export default async function transcribe(request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) return json({ error: 'กรุณาส่งไฟล์เสียงแบบ form-data' }, 415);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: 'ยังไม่ได้ตั้งค่า GEMINI_API_KEY บน Netlify' }, 503);
  try {
    const formData = await request.formData(); const audio = formData.get('audio');
    if (!audio || typeof audio.arrayBuffer !== 'function') return json({ error: 'ไม่พบไฟล์เสียง' }, 400);
    if (!audio.type.startsWith(ALLOWED_AUDIO_PREFIX)) return json({ error: 'รองรับเฉพาะไฟล์เสียง' }, 415);
    if (audio.size === 0) return json({ error: 'ไฟล์เสียงว่างเปล่า' }, 400);
    if (audio.size > MAX_FILE_BYTES) return json({ error: 'ไฟล์ใหญ่เกิน 4 MB' }, 413);
    const mimeType = mimeTypeFor(audio);
    const inlineAudio = Buffer.from(await audio.arrayBuffer()).toString('base64');
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [
          { inlineData: { mimeType, data: inlineAudio } },
          { text: 'ถอดเสียงทั้งหมดในไฟล์นี้เป็นข้อความ อ่านง่าย รักษาภาษาต้นฉบับของผู้พูด และตอบเฉพาะข้อความถอดเสียงเท่านั้น' },
        ] }],
        generationConfig: { temperature: 0.1 },
      }),
    });
    const payload = await geminiResponse.json().catch(() => ({}));
    if (!geminiResponse.ok) {
      const message = payload?.error?.message || `บริการ Gemini ตอบกลับด้วยสถานะ ${geminiResponse.status}`;
      console.error('Gemini transcription failed', geminiResponse.status, message);
      return json({ error: `Google Gemini: ${message}` }, 502);
    }
    const text = getTranscript(payload);
    if (!text) return json({ error: 'Google Gemini ไม่ได้คืนข้อความถอดเสียง ลองเลือกไฟล์ที่มีเสียงพูดชัดเจน' }, 502);
    return json({ text });
  } catch (error) { console.error('Transcription request failed', error); return json({ error: error.message || 'ประมวลผลไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' }, 500); }
}
export const config = { path: '/.netlify/functions/transcribe', method: 'POST', rateLimit: { windowLimit: 3, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
