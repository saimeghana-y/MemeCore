import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function convertToTweet(prompt) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      return text; // Return the generated text
    } catch (error) {
      throw new Error('Error generating suggestions index.js');
    }
}