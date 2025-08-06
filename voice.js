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

    const filePath = path.join(__dirname, 'response.mp3');
    fs.writeFileSync(filePath, response.data);

    // You can upload this to S3 or serve it from a public endpoint — for now:
    return 'https://your-public-server.com/response.mp3';

  } catch (err) {
    console.error("Error generating ElevenLabs speech:", err.response?.data || err.message);
    return null;
  }
};
