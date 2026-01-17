import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        const prompt = `
      あなたは自虐風自慢（謙遜しているように見せかけて実は自慢している発言）を検知する専門家です。
      以下のテキストを分析し、それが「自虐風自慢」であるかどうかを判定してください。
      
      テキスト: "${text}"
      
      以下のJSON形式のみで回答してください。余計な文字列は含めないでください。
      {
        "isHumbleBrag": boolean, // 自虐風自慢ならtrue、そうでなければfalse
        "reason": string, // その判定理由（日本語で、面白おかしく辛辣に解説してください）
        "bragLevel": number // 自慢度合いを0〜100で評価
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up markdown code blocks if present
        const cleanJson = textResponse.replace(/^```json\n|\n```$/g, "").trim();

        try {
            const jsonResponse = JSON.parse(cleanJson);
            return NextResponse.json(jsonResponse);
        } catch (e) {
            console.error("Failed to parse Gemini response:", textResponse);
            return NextResponse.json(
                { error: "Failed to parse analysis result", raw: textResponse },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error("Error asking Gemini:", error);
        if (error.response) {
            console.error("Error details:", error.response);
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
