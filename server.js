require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const aiReply = require('./ai');
const generateSpeech = require('./voice');
const calendar = require('./calendar');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/voice', async (req, res) => {
  const twiml = new VoiceResponse();

  try {
    const question = "Hi there! Welcome to Golden Nails. How can I help you today?";
    const aiResponse = await aiReply(question);
    const audioUrl = await generateSpeech(aiResponse);

    twiml.play(audioUrl); // Stream ElevenLabs audio
    twiml.pause({ length: 2 }); // Add small pause
    twiml.say("Goodbye for now!");

    res.type('text/xml');
    res.send(twiml.toString());

  } catch (err) {
    console.error("Error handling call:", err);
    twiml.say("Sorry, we're having trouble right now. Please call again later.");
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
