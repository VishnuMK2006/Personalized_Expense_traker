const axios = require('axios');

const chatWithOllama = async (req, res) => {
  try {
    const { message } = req.body;
    
    console.log('Sending request to Ollama with message:', message);
    
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral',
      prompt: message,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40
      }
    });

    console.log('Ollama response:', response.data);

    if (response.data && response.data.response) {
      res.json({ response: response.data.response });
    } else {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format from Ollama');
    }
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    // Check if it's a connection error
    if (error.code === 'ECONNREFUSED') {
      res.status(500).json({ 
        error: 'Could not connect to Ollama. Please make sure Ollama is running on port 11434.',
        details: error.message 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to communicate with AI model',
        details: error.message 
      });
    }
  }
};

module.exports = {
  chatWithOllama
}; 