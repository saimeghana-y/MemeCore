import convertToTweet from "@/utilities/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("Received prompt:", prompt);
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const aiResponse = await convertToTweet(prompt);
    console.log("aiResponse", aiResponse);
    return NextResponse.json({ text: aiResponse });
  } catch (error) {
    console.error("Error generating response:", error.message);
    return NextResponse.json({ error: 'Error generating response route.js' }, { status: 500 });
  }
}