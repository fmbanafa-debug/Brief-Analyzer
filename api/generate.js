import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(request, response) {
    // 1. Check for POST method
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Get the API Key securely from Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'API key is missing. Ensure GEMINI_API_KEY is set in Vercel Environment Variables and redeploy.' 
    });
  }

    try {
        // 3. Extract the exact payload your frontend sends
        // Your frontend sends { contents: [...], generationConfig: ... }
        const { contents, generationConfig } = request.body;

        // 4. Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Use flash model
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // ... after initializing genAI ...

        const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        // Add System Instructions here to force "OCR Mode"
        systemInstruction: "You are a specialized image OCR Analyzer. Your goal is to extract every piece of text from provided images with 100% accuracy. Maintain the original structure, identify headers, and do not hallucinate text that isn't there."
        });

        // ... continue to generateContent ...

        
        // 5. Generate Content
        // We pass the "contents" and "generationConfig" exactly as the frontend prepared them
        const result = await model.generateContent({
            contents,
            generationConfig
        });

        const aiResponse = await result.response;
        
        // 6. Return the full response structure the frontend expects
        // Your frontend looks for result.candidates[0].content.parts[0].text
        // The SDK response object usually needs to be serialized to JSON:
        const responseData = {
            candidates: [
                {
                    content: {
                        parts: [
                            { text: aiResponse.text() }
                        ]
                    }
                }
            ]
        };

        return response.status(200).json(responseData);

    } catch (error) {
        console.error("AI Generation Error:", error);
        return response.status(500).json({ error: error.message || 'Error generating content' });
    }
}
