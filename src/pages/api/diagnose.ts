import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image data is required.' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Missing GEMINI_API_KEY in environment.',
      });
    }

    const geminiEndpoint =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

    const geminiPayload = {
      contents: [
        {
          parts: [
            {
              text: `
You are an expert plant pathologist. Diagnose the disease visible in the following plant image. Respond ONLY with a JSON object and nothing else. No explanations. No markdown. Only JSON. Format exactly:

{
  "disease": "...",
  "confidence": 0-100,
  "severity": "...",
  "description": "...",
  "treatment": "...",
  "prevention": "..."
}
              `
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: imageBase64,
              },
            },
          ],
        },
      ],
    };

    const geminiResponse = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(geminiPayload),
    });

    const geminiData = await geminiResponse.json();

    console.log("Gemini FULL raw response:");
    console.dir(geminiData, { depth: null });

    const textResponse =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log("Gemini text response:", textResponse);

    if (!textResponse) {
      return res.status(500).json({
        error: 'Gemini returned empty result. Check your prompt or try a different image.',
      });
    }

    let diagnosis;

    try {
      diagnosis = JSON.parse(textResponse);
    } catch (e) {
      console.warn("Direct JSON parse failed, trying to extract JSON block...");
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        diagnosis = JSON.parse(jsonMatch[0]);
      } else {
        console.error("No JSON block found in Gemini response.");
        return res.status(500).json({
          error: "Failed to parse Gemini result. Raw output: " + textResponse,
        });
      }
    }

    return res.status(200).json(diagnosis);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
