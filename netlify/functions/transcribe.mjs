const MAX_FILE_BYTES = 4 * 1024 * 1024;
const ALLOWED_AUDIO_PREFIX = 'audio/';
function json(body, status = 200) { return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } }); }
function getTranscript(payload) { return payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim(); }
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
    const base64Audio = Buffer.from(await audio.arrayBuffer()).toString('base64');
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-transcribe:generateContent', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({ contents: [{ parts: [{ inlineData: { mimeType: audio.type, data: base64Audio } }] }], generationConfig: { audioTranscriptionConfig: { mode: 'SMART' } } }),
    });
    const payload = await geminiResponse.json().catch(() => ({}));
    if (!geminiResponse.ok) { console.error('Gemini transcription failed', geminiResponse.status, payload?.error?.message); return json({ error: 'Google Gemini ไม่สามารถถอดเสียงได้ กรุณาลองใหม่อีกครั้ง' }, 502); }
    const text = getTranscript(payload);
    if (!text) return json({ error: 'Google Gemini ไม่ได้คืนข้อความถอดเสียง' }, 502);
    return json({ text });
  } catch (error) { console.error('Transcription request failed', error); return json({ error: 'ประมวลผลไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' }, 500); }
}
export const config = { path: '/.netlify/functions/transcribe', method: 'POST', rateLimit: { windowLimit: 3, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
