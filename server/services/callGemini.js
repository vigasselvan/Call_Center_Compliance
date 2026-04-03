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
            status:{
                type: SchemaType.STRING,
                enum: ["Success", "Failure"],
                description: "True if got answer, false if there is no output",
            },
            language:{
                type: SchemaType.STRING,
                description: "Mention the one most used Language in the input",
            },
            transcript:{
                type: SchemaType.STRING,
                description: "convert the audio given into a text format and mentioned here",
            },
            summary:{
                type: SchemaType.STRING,
                description: "Concise AI-powered summary of the conversation",
            },
            sop_validation:{
                type: SchemaType.OBJECT,
                properties: {
                    greeting:{
                        type: SchemaType.BOOLEAN,
                        description: "Had the agent made greetings to the customer ?",
                    },
                    identification:{
                        type: SchemaType.BOOLEAN,
                        description: "Had the agent checked he is speaking to correct customer?",
                    },
                    problemStatement:{
                        type: SchemaType.BOOLEAN,
                        description: "Had the agent mentioned the problem or reason he made call to the customer?",  
                    },
                    solutionOffering:{
                        type: SchemaType.BOOLEAN,
                        description: "Had the agent mentioned the solution to the problem mentioned by customer ?",  
                    },
                    closing:{
                        type: SchemaType.BOOLEAN,
                        description: "Had the agent mentioned thanksgiving at the end of call ?",  
                    },
                    complianceScore:{
                        type: SchemaType.NUMBER,
                        description: "A value between 0 and 1 indicating had the agent followed SOP steps",
                    },
                    adherenceStatus:{
                        type: SchemaType.STRING,
                        enum: ["FOLLOWED", "NOT_FOLLOWED"],
                        description: "if the agent adherenced to the SOP mention FOLLOWED else mention NOT_FOLLOWED",
                    },
                    explanation:{
                        type: SchemaType.STRING,
                        description: "Mention consice summary result of SOP validation",
                    }
                },
                description: "Correct detection of whether the agent followed the SOP steps:  greeting, identification, problemStatement, solutionOffering, closing, complianceScore (0.0 to 1.0) and adherenceStatus.",
            },
            analytics:{
                type: SchemaType.OBJECT,
                properties: {
                    paymentPreference:{
                        type: SchemaType.STRING,
                        enum: ["EMI", "FULL_PAYMENT", "PARTIAL_PAYMENT", "DOWN_PAYMENT"],
                        description: "select Correct categorization of payment preference (EMI, FULL_PAYMENT, PARTIAL_PAYMENT, DOWN_PAYMENT) mentioned by the customer",
                    },
                    rejectionReason:{
                        type: SchemaType.STRING,
                        enum: ["HIGH_INTEREST", "BUDGET_CONSTRAINTS", "ALREADY_PAID", "NOT_INTERESTED", "NONE"],
                        description: "select Correct categorization of reason rejecting the offering/payment (HIGH_INTEREST, BUDGET_CONSTRAINTS, ALREADY_PAID, NOT_INTERESTED, NONE) mentioned by the customer",
                    },
                    sentiment:{
                        type: SchemaType.STRING,
                        enum: ["positive", "neutral", "negative"],
                        description: "what is the sentiment or mood of the customer (Positive, Negative, Neutral)?",
                    }
                },
                description: "Correct categorization of payment preference (EMI, FULL_PAYMENT, PARTIAL_PAYMENT, DOWN_PAYMENT) Correct identification of the reason if payment was not completed",
            },
            Keywords:{
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description: "Detects the main keywords from the transcript and summary",
            }
        },
        required: ["status", "language", "transcript", "summary", "sop_validation", "analytics", "Keywords"],
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
    const prompt = `This is an audio file in ${lang}. Please transcribe it and summarize the main points, perform SOP Validation by Correct detection of whether the agent followed the SOP steps, perform Analytics Correct categorization of payment preference and correct identification of the reason if payment was not completed, perform Keywords Detects the main keywords from the transcript and summary in JSON format.`;

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