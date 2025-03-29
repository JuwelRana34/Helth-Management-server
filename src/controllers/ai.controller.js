const { OpenAI } = require("openai");
exports.Ai = async function (req, res) {
    const text = req.body.Text;
    const baseURL = "https://api.aimlapi.com/v1";
    const apiKey = process.env.AI_KEY;
    try{
    const api = new OpenAI({
      apiKey,
      baseURL,
    });
  
  //   deepseek

  const response = await  await api.chat.completions.create({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    messages: [
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.7,
    max_tokens: 256,
  });

      const mainResponse = response?.choices?.[0]?.message?.content;
      if (!mainResponse)  return res.status(500).json({ response: "try again" });
        res.status(200).json({ response: mainResponse });
    }catch (e) {
        console.log(e)
    }

}