
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

// Load .env.local
config({ path: '.env.local' });

async function testAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ No GEMINI_API_KEY found in environment!");
        process.exit(1);
    }
    console.log("✅ GEMINI_API_KEY found:", apiKey.substring(0, 5) + "...");

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });

        console.log("Attempting to generate content with model: gemini-2.0-flash");
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
                { role: 'user', parts: [{ text: "Hello, are you working?" }] }
            ]
        });

        console.log("✅ Response received:");
        console.log(response.text());
    } catch (error) {
        console.error("❌ Error testing AI:");
        console.error(error);
    }
}

testAI();
