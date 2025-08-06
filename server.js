require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const aiReply = require('./ai');
const generateSpeech = require('./voice');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve audio folder
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/voice', async (req, res) => {
  const twiml = new VoiceResponse();

  try {
    const userPrompt = "Hi there! Welcome to Golden Nails. How can I help you today?";
    const responseText = await aiReply(userPrompt);
    const audioUrl = await generateSpeech(responseText);

    if (audioUrl) {
      twiml.play(audioUrl);
    } else {
      twiml.say("Sorry, I'm having trouble generating a response.");
    }

    twiml.pause({ length: 1 });
    twiml.say("Goodbye for now!");

    res.type('text/xml');
    res.send(twiml.toString());

  } catch (err) {
    console.error("Twilio Voice Error:", err);
    twiml.say("Sorry, an error occurred.");
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
