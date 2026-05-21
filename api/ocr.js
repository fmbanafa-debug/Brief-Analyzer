import Tesseract from 'tesseract.js';

export default async function handler(req, res) {
  const { image } = req.body; // base64 image data from frontend

  try {
    const { data: { text } } = await Tesseract.recognize(
      image,
      'eng',
      { logger: m => console.log(m) }
    );
    
    return res.status(200).json({ extractedText: text });
  } catch (error) {
    return res.status(500).json({ error: "OCR failed to read image" });
  }
}
