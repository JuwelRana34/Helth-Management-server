exports.Ai = async function (req, res) {
    const text = req.body.Text;
   
    try{

    //  const response = await  fetch("https://openrouter.ai/api/v1/chat/completions", {
    //     method: "POST",
    //     headers: {
    //       "Authorization": `Bearer ${process.env.AI_KEY}`, 
    //       "HTTP-Referer": "https://healthcarebd2.netlify.app/", 
    //       "X-Title": "healthcarebd2", 
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       "model": "google/gemini-2.5-pro-exp-03-25:free",
    //       "messages": [
    //         {
    //           "role": "user",
    //           "content": [
    //             {
    //               "type": "text",
    //               "text": text
    //             },
    //             // {
    //             //   "type": "image_url",
    //             //   "image_url": {
    //             //     "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
    //             //   }
    //             // }
    //           ]
    //         }
    //       ]
    //     })
    //   }); 

    // deepseek

  const response = await  fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AI_KEY}`, // Required. Your OpenRouter API key.
        "HTTP-Referer": "https://healthcarebd2.netlify.app/", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "healthcarebd2", // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-chat-v3-0324:free",
        "messages": [
          {
            "role": "user",
            "content": text
          }
        ]
      })
    });

      const data = await response.json();
      const mainResponse = data?.choices?.[0]?.message?.content;
      if (!mainResponse)  return res.status(500).json({ response: "try again" });
        res.status(200).json({ response: mainResponse });
    }catch (e) {
        console.log(e)
    }

}