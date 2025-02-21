
import generateContent from '../services/ai.service.js';  

const getReview = async (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).send("Prompt is required");
  }

  try {
    // Call the generateContent function from aiService
    const aiResponse = await generateContent(code);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error with AI service:', error);
    res.status(500).send("Something went wrong with AI service");
  }
};

export default { getReview };
