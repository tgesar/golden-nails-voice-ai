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

    const fileName = 'response.mp3';
    const filePath = path.join(__dirname, 'public', 'audio', fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, response.data);

    // Return the public URL for Twilio to access
    return `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'golden-nails-voice-ai.onrender.com'}/audio/${fileName}`;

  } catch (err) {
    console.error("Error generating ElevenLabs speech:", err.response?.data || err.message);
    return null;
  }
};
