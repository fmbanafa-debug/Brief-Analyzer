import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { title, summary, userQuery } = request.body;

    // Use the Flash model for speed and cost
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    const prompt = `You are a financial analyst. Analyze ${title} (${summary}). 
    User Question: ${userQuery}
    Keep it concise. Use markdown formatting (bolding, lists).`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return response.status(200).json({ answer: text });
    
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
}
