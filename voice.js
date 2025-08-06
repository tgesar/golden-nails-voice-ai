const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ELEVENLABS_VOICE_ID = process.env.ELEVEN_VOICE_ID;

module.exports = async function generateSpeech(text) {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVEN_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    const filePath = path.join(__dirname, 'public/audio/response.mp3');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, response.data);

    return `${process.env.RENDER_EXTERNAL_HOSTNAME
      ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
      : 'https://golden-nails-voice-ai.onrender.com'
    }/audio/response.mp3`;

  } catch (err) {
    console.error("ElevenLabs error:", err.response?.data || err.message);
    return null;
  }
};
