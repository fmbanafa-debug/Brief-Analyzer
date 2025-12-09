// api/generate.js
export default async function handler(req, res) {
  // 1. Get the key from the secure environment variable
  const apiKey = process.env.GEMINI_API_KEY;

  // 2. Define the Google API URL (Change 'gemini-1.5-flash' if you use a different model)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  // 3. Forward the request to Google
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body), // Pass the data from your frontend
    });

    const data = await response.json();
    res.status(200).json(data); // Send Google's answer back to your page
  } catch (error) {
    res.status(500).json({ error: "Error fetching from Google" });
  }
}
