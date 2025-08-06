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
            content: "You're a helpful, casual receptionist at a nail salon in Golden Valley, MN. Keep responses short and friendly."
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
    console.error("OpenAI error:", error.response?.data || error.message);
    return "Sorry, I can't help right now.";
  }
};
