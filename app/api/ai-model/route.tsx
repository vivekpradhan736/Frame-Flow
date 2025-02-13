import Constants from "@/data/Constants";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

export const maxDuration = 300;

// Function to convert an image URL to a Base64 string (Server-Side Fix)
async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer(); // Fetch image as array buffer
  const base64Image = Buffer.from(arrayBuffer).toString("base64"); // Convert buffer to base64
  return base64Image;
}

export async function POST(req: NextRequest) {
  try {
    const { model, description, imageUrl } = await req.json();

    // Get the correct model name from Constants
    const ModelObj = Constants.AiModelList.find(item => item.name === model);
    const modelName = ModelObj?.modelName || "gemini-1.5-pro"; // Use Gemini Vision model

    // Initialize Gemini model
    const modelInstance = genAI.getGenerativeModel({ model: modelName });

    // Prepare input for Gemini
    const inputParts: Part[] = [{ text: description }];

    if (imageUrl) {
      const base64Image = await fetchImageAsBase64(imageUrl);
      inputParts.push({
        inlineData: {
          mimeType: "image/png", // Adjust format if needed
          data: base64Image, // Use Base64-encoded image data
        },
      });
    }

    // Call Gemini API
    const response = await modelInstance.generateContent({
      contents: [{ role: "user", parts: inputParts }],
    });

    // Stream response back to client
    const stream = new ReadableStream({
      async start(controller) {
        const text = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        controller.enqueue(new TextEncoder().encode(text)); // Send data chunk
        controller.close(); // End stream
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
