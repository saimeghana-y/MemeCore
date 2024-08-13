import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function convertToTweet(prompt) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = await response.text();
      // Remove Markdown formatting
      text = text.replace(/[*#_]/g, ''); // Removes *, #, and _ used in Markdown

      return text; // Return the generated text
    } catch (error) {
      throw new Error('Error generating suggestions index.js');
    }
}