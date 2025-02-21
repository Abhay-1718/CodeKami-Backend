
import generateContent from '../services/ai.service.js';  

const getReview = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    console.log('Processing code review request'); // Debug log
    const aiResponse = await generateContent(code);
    
    return res.json({ response: aiResponse });
  } catch (error) {
    console.error('AI Service Error:', error);
    return res.status(500).json({ error: 'AI service error' });
  }
};

export default { getReview };
