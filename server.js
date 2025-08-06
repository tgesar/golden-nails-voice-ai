require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const aiReply = require('./ai');
const generateSpeech = require('./voice');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ Publicly serve audio files
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

// ✅ Main route triggered by Twilio on incoming calls
app.post('/voice', async (req, res) => {
  const twiml = new VoiceResponse();

  try {
    const prompt = "Hi there! Welcome to Golden Nails. How can I help you today?";
    const aiResponse = await aiReply(prompt);
    const audioUrl = await generateSpeech(aiResponse);

    if (audioUrl) {
      twiml.play(audioUrl);
    } else {
      twiml.say("Sorry, I couldn't generate a response.");
    }

    res.type('text/xml');
    res.send(twiml.toString());

  } catch (err) {
    console.error("❌ Error handling voice call:", err);
    twiml.say("We're experiencing issues. Please call back later.");
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
