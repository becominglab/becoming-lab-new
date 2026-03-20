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
      prompt = `Professional architectural floor plan, top-down orthographic view, of a Japanese ${housingDesc} LDK (living-dining-kitchen) room, ${sizeDesc}. Precisely drawn with thin black lines on white background. Include:
- Accurate wall thickness (150mm for exterior, 100mm for interior)
- Standard Japanese architectural symbols: sliding doors, hinged doors with arc, windows with double lines
- Furniture layout drawn to scale: ${style === "modern" ? "L-shaped sofa, glass coffee table, wall-mounted TV" : style === "natural" || style === "nordic" ? "3-seater fabric sofa, wooden coffee table, TV board" : "sofa, coffee table, TV unit"}, 4-person dining table with chairs, kitchen counter
- Dimensions marked in millimeters with dimension lines and arrows
- Room labels in Japanese (リビング, ダイニング, キッチン)
- North arrow indicator
- Scale bar (1:50)
- Tatami grid reference lines
Style: Clean CAD-quality architectural drawing, monochrome, no colors, no shading, no 3D effects, no watermarks. Similar to a real Japanese 間取り図 from a housing catalog.`;
    } else {
      prompt = `Award-winning interior photography of a real Japanese ${housingDesc} living room, ${sizeDesc}. Captured with a Canon EOS R5, 16-35mm wide-angle lens at f/8, natural window light streaming in.

Interior style: ${styleDescriptions[style] || style}.
Color palette: ${colorDescriptions[colorTone] || colorTone}.

The room features real, existing furniture brands popular in Japan (SIEVE, IDEE, Artek style). Include specific details:
- ${style === "natural" ? "Solid oak flooring, linen curtains, a potted monstera plant, woven basket storage" : style === "modern" ? "Polished concrete-look flooring, roller blinds, geometric pendant light, matte black hardware" : style === "nordic" ? "Light birch herringbone floor, sheepskin throw on chair, Danish pendant lamp, ceramic vases" : style === "industrial" ? "Reclaimed wood accent wall, exposed black steel shelving, concrete planter, Edison pendant lights" : style === "japandi" ? "Light oak flooring with tatami insert area, shoji-inspired partition, low walnut table, ceramic sake set on shelf" : "White-washed wood floor, rattan armchair, linen sofa with blue cushions, woven jute rug"}
- Realistic window view showing ${housing === "mansion" ? "a city skyline through large balcony windows" : "a Japanese garden with trees through floor-to-ceiling windows"}
- Warm afternoon sunlight casting natural shadows
- Lived-in feeling with a coffee cup on the table, an open book, a folded throw blanket

Photo style: Editorial interior photography for a premium Japanese housing magazine like &Premium or Casa BRUTUS. Photorealistic, no CGI look, no watermarks, no text overlays. The image should look like a real photograph taken in an actual home.`;
    }

    const openai = getOpenAI();
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
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
