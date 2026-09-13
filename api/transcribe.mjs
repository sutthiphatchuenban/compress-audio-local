// Vercel Function entry point. The shared handler keeps the Netlify and Vercel
// deployments behaviorally identical while using each platform's route.
export { default } from '../netlify/functions/transcribe.mjs';
