require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const aiReply = require('./ai');
const generateSpeech = require('./voice');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve /audio as static public route
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

// Root (optional)
app.get('/', (req, res) => {
  res.send('Golden Nails AI is live!');
});

// Voice webhook route for Twilio
app.post('/voice', async (req, res) => {
  const twiml = new VoiceResponse();

  try {
    console.log('📞 Incoming call received.');

    const question = "Hi there! Welcome to Golden Nails. How can I help you today?";
    const aiResponse = await aiReply(question);

    console.log('🤖 AI Response:', aiResponse);

    const audioUrl = await generateSpeech(aiResponse);

    if (audioUrl) {
      console.log('🔊 Audio generated at:', audioUrl);
      twiml.play(audioUrl);
    } else {
      console.log('⚠️ Failed to generate audio');
      twiml.say("Sorry, I couldn't generate a response.");
    }

    res.type('text/xml');
    res.send(twiml.toString());

  } catch (err) {
    console.error('❌ Error during /voice:', err);
    twiml.say("Sorry, we're having issues right now. Please try again later.");
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
