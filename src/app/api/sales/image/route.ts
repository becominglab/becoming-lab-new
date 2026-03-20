import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  try {
    const { type, style, colorTone, roomSize, housing } = await request.json();

    if (!type || !style) {
      return NextResponse.json({ error: "パラメータが不足しています" }, { status: 400 });
    }

    const styleDescriptions: Record<string, string> = {
      natural: "natural wood, warm tones, organic textures, plants, linen fabrics",
      modern: "minimalist, monochrome, clean lines, matte black accents, flat surfaces",
      nordic: "Scandinavian hygge style, soft pastels, round furniture, pendant lights, cozy textiles",
      industrial: "exposed brick, steel pipes, reclaimed wood, Edison bulbs, concrete floors",
      japandi: "Japanese-Scandinavian fusion, wabi-sabi, low furniture, tatami accents, neutral tones",
      coastal: "white and blue palette, rattan furniture, driftwood accents, airy and light",
    };

    const colorDescriptions: Record<string, string> = {
      white: "predominantly white and off-white palette",
      beige: "warm beige and cream tones",
      gray: "sophisticated gray palette",
      brown: "rich brown and wood tones",
      black: "dark and moody with black accents",
      green: "sage green and natural green accents",
    };

    const housingDesc = housing === "mansion" ? "apartment/condominium" : "detached house";
    const sizeDesc = `${roomSize} tatami mats (approximately ${Math.round(Number(roomSize) * 1.65)} square meters)`;

    let prompt: string;

    if (type === "floorplan") {
      prompt = `A clean, professional 2D architectural floor plan of a ${housingDesc} living-dining room, ${sizeDesc}. ${style} style layout. Show furniture placement including sofa, dining table, TV unit, and storage. Clean white background, architectural line drawing style, labeled in Japanese. Top-down view, precise measurements, professional architectural rendering. No text watermarks.`;
    } else {
      prompt = `A photorealistic interior design 3D rendering of a ${housingDesc} living room, ${sizeDesc}. Style: ${styleDescriptions[style] || style}. Color scheme: ${colorDescriptions[colorTone] || colorTone}. High-end furniture, natural lighting from large windows, warm atmosphere. Shot at eye level with wide-angle lens. Professional interior photography quality, 8K detail, no people, no text.`;
    }

    const openai = getOpenAI();
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: "画像を生成できませんでした" }, { status: 500 });
    }

    return NextResponse.json({ url: imageUrl, type });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "画像生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
