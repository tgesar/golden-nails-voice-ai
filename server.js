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

app.post('/voice', async (req, res) => {
  const twiml = new VoiceResponse();

  try {
    const question = "Hi there! Welcome to Golden Nails. How can I help you today?";
    const aiResponse = await aiReply(question);
    const audioUrl = await generateSpeech(aiResponse);

    if (audioUrl) {
      twiml.play(audioUrl);
    } else {
      twiml.say("Sorry, I couldn't generate a response.");
    }

    twiml.pause({ length: 1 });
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

app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
