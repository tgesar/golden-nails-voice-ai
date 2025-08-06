const axios = require('axios');

module.exports = async function aiReply(prompt) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You're a friendly receptionist for a nail salon called Golden Nails in Golden Valley, MN. Answer clearly and casually. Keep responses under 2 sentences."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error.response?.data || error.message);
    return "Sorry, I'm having trouble responding right now.";
  }
};
