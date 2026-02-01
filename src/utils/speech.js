import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
});

const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

let currentAudio = null;

export async function speakAsStocky(text) {
  try {
    // Stop anything currently playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audioStream = await client.textToSpeech.convert(VOICE_ID, {
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.85,
        style: 0.4,
        use_speaker_boost: true,
      },
    });

    // Convert stream into playable audio
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const blob = new Blob(chunks, { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    currentAudio = new Audio(url);
    currentAudio.play();

    // Cleanup after it finishes playing
    currentAudio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
    };

    return true;
  } catch (error) {
    console.error("ElevenLabs error:", error);
    return false; // Fails silently, text still shows
  }
}

export function stopSpeech() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}