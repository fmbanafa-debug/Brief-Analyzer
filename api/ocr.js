import Tesseract from 'tesseract.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { image } = request.body; 

  if (!image) {
    return response.status(400).json({ error: 'No image data provided' });
  }

  try {
    // Perform OCR using Tesseract.js
    const { data: { text } } = await Tesseract.recognize(
      image,
      'eng',
      { logger: m => console.log(m) }
    );
    
    return response.status(200).json({ extractedText: text });
  } catch (error) {
    console.error("OCR Error:", error);
    return response.status(500).json({ error: "OCR failed to read image" });
  }
}
