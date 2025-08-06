require('dotenv').config(); // ✅ THIS LINE IS CRUCIAL

const generateSpeech = require('./voice');

generateSpeech("Hello! This is your Golden Nails AI receptionist. How can I help you?")
  .then(url => console.log("✔️ Audio hosted at:", url))
  .catch(err => console.error("❌ Error generating speech:", err));
