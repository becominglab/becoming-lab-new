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
      prompt = `Japanese residential floor plan (間取り図) in the style of madree.jp or SUUMO housing catalog. Top-down 2D architectural blueprint of a ${housingDesc} LDK layout, ${sizeDesc}.

Drawing style:
- Clean vector-like lines on pure white background
- Walls drawn as thick filled black rectangles (exterior 150mm, interior 100mm scale)
- Standard Japanese architectural plan symbols: hinged doors shown with 90-degree arc sweep, sliding doors with parallel dashed lines, windows as double parallel lines with center line
- All furniture shown as simple geometric outlines from above (no 3D, no shading, no perspective)

Room layout includes:
- リビング (Living): ${style === "modern" ? "L-shaped sofa, glass coffee table, wall-mounted TV unit" : style === "natural" || style === "nordic" ? "3-seater sofa, oval coffee table, low TV board" : "sofa, coffee table, TV board"}
- ダイニング (Dining): rectangular table with 4 chairs shown as small squares
- キッチン (Kitchen): I-type or peninsula counter with sink circle and stove circles, refrigerator rectangle
- ${housing === "mansion" ? "バルコニー (balcony) indicated with dashed rectangle outside south windows" : "庭 (garden) area indicated outside"}

Annotations:
- Room names labeled in Japanese kanji (リビング, ダイニング, キッチン, 洋室, 玄関)
- Dimension lines with millimeter measurements and arrow endpoints
- 方位 (North arrow) compass indicator in corner
- Scale notation 1:50
- Area notation in 畳 (tatami) and m²
- Grid lines at 910mm module (Japanese construction module)

CRITICAL: This must look like a real Japanese 間取り図 used by 住宅メーカー. Monochrome only, absolutely no colors, no watercolor, no artistic rendering, no 3D perspective, no furniture photos. Pure technical architectural plan drawing.`;
    } else {
      prompt = `Ultra-photorealistic interior photograph of a real Japanese ${housingDesc} living-dining room, ${sizeDesc}. Shot on Phase One IQ4 150MP medium format digital back with Schneider Kreuznach 28mm lens, f/11, ISO 100, tripod-mounted. Golden hour natural light flooding through windows with soft shadow play on walls and floor.

Interior design style: ${styleDescriptions[style] || style}.
Color scheme: ${colorDescriptions[colorTone] || colorTone}.

Specific materials and textures (must be hyper-detailed):
- ${style === "natural" ? "190mm wide European oak engineered flooring with visible grain and matte oil finish, linen sheer curtains with gentle folds, large Ficus lyrata plant in a hand-thrown ceramic pot, woven seagrass basket with throw blankets" : style === "modern" ? "Polished microcement flooring in light gray, motorized roller blinds in charcoal fabric, Tom Dixon Beat pendant lights in brass, matte black aluminum cabinet handles, fluted glass partition" : style === "nordic" ? "Light Scandinavian birch herringbone parquet with satin finish, genuine sheepskin draped over a Wegner CH07 shell chair, Louis Poulsen PH5 pendant lamp, handmade ceramic Kähler vases with dried pampas grass" : style === "industrial" ? "Reclaimed barn wood accent wall with visible nail holes and patina, powder-coated black steel open shelving with raw edge wood shelves, large concrete planter with snake plant, cluster of Edison ST64 filament bulbs on twisted fabric cord" : style === "japandi" ? "200mm wide white oak flooring transitioning to traditional tatami insert area with proper igusa rush, shoji-screen inspired room divider with washi paper panels, low solid walnut Nakashima-inspired coffee table, Arita porcelain tea set on floating shelf" : "White-washed reclaimed pine plank floor with subtle gaps, natural rattan Serena & Lily armchair, stonewashed Belgian linen sofa in soft blue with down-filled cushions, handwoven jute area rug with fringe detail"}

Room details:
- ${housing === "mansion" ? "Floor-to-ceiling tempered glass sliding doors (2400mm height) opening to a balcony with aluminum railing, city panorama visible with subtle atmospheric haze" : "Large Low-E double-pane sliding glass doors (2200mm height) opening to a landscaped Japanese garden with mature Acer palmatum, moss-covered stepping stones, and bamboo fence"}
- Afternoon sunlight streaming in at 45 degrees, creating long warm shadows across the floor and wall
- Lived-in atmosphere: a steaming ceramic coffee mug on the table, dog-eared paperback book, casually draped cashmere throw, a pair of reading glasses

Camera and lighting: This must look indistinguishable from a real photograph published in &Premium magazine, Casa BRUTUS, or Architectural Digest Japan. 8K resolution quality. Shallow depth of field with background slightly soft. Color grading: warm, slightly desaturated, film-like tones. Absolutely NO CGI artifacts, NO perfect symmetry, NO floating objects, NO text, NO watermarks. Must pass as a real photograph of a real home.`;
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
