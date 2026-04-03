import dotenv from 'dotenv';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

dotenv.config({ path: './config.env' });

// 1. Initialize with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ Key Check: Still Missing! Check for typos in callGemini.js");
} else {
    console.log("✅ Key Check: Found! Key starts with:", apiKey.substring(0, 4));
}

async function askGemini(question) {
    // 2. Define the JSON structure you want back
    const schema = {
        description: "Response to a user question with metadata",
        type: SchemaType.OBJECT,
        properties: {
            answer: {
                type: SchemaType.STRING,
                description: "The direct answer to the question.",
            },
            confidence_score: {
                type: SchemaType.NUMBER,
                description: "A value between 0 and 1 indicating how certain the AI is.",
            },
            sources: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description: "List of sources or key facts used.",
            },
        },
        required: ["answer", "confidence_score"],
    };

    // 3. Setup the model (Flash is the fastest/cheapest/free-tier friendly)
    const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    let lang = null, audioFormt = null, audioBas64 = null;

    if(question && question.hasOwnProperty("language")){
        lang = question.language;
    }

    if(question && question.hasOwnProperty("audioFormat")){
        audioFormt = question.audioFormat;
    }

    if(question && question.hasOwnProperty("audioBase64")){
        audioBas64 = question.audioBase64;
    }

    // 1. Map your audioFormat to a proper MIME type
    // Gemini supports: audio/wav, audio/mp3, audio/aiff, audio/aac, etc.
    const mimeType = audioFormt === "mp3" ? "audio/mpeg" : `audio/${audioFormt}`;

    // 2. Build the prompt using your metadata
    const prompt = `This is an audio file in ${lang}. Please transcribe it and summarize the main points in JSON format.`;

    // 3. Send the specific parts to Gemini
    const result = await model.generateContent([
        {
            inlineData: {
                mimeType: mimeType,
                data: audioBas64 // Send only the string, not the full JSON
            }
        },
        prompt,
    ]);

    console.log(result.response.text());
    return result.response.text();
}

export default askGemini;

// // Example usage:
// askGemini("What are the three largest moons of Jupiter and their diameters?");