const fs = require('fs');
const axios = require('axios');
const path = require('path');

require('dotenv').config();

const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;
const ELEVEN_VOICE_ID = process.env.ELEVEN_VOICE_ID || 'Rachel'; // Default fallback

const generateSpeech = async (text) => {
  try {
    const outputPath = path.join(__dirname, 'public', 'audio', 'response.mp3');

    // Request to ElevenLabs
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`,
      headers: {
        'xi-api-key': ELEVEN_API_KEY,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer',
      data: {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.75
        }
      }
    });

    // Save audio
    fs.writeFileSync(outputPath, response.data);
    console.log('✅ Audio saved at:', outputPath);
    return 'https://golden-nails-voice-ai.onrender.com/audio/response.mp3';

  } catch (err) {
    const errData = err.response?.data;
    if (errData instanceof Buffer) {
      console.error('ElevenLabs error:', JSON.parse(errData.toString()));
    } else {
      console.error('ElevenLabs error:', errData || err.message);
    }
    throw new Error('Failed to generate audio');
  }
};

module.exports = generateSpeech;
