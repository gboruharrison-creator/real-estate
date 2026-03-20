import { properties } from "../data/properties";

const propertySummary = properties.map((p) =>
  `ID:${p.id} | ${p.title} | ${p.type === "rent" ? "£" + p.pricePerMonth + "pcm" : "£" + p.price?.toLocaleString()} | ${p.bedrooms} bed | ${p.propertyType} | ${p.area} | ${p.sqft} sqft | Features: ${p.features.slice(0, 4).join(", ")}`
).join("\n");

const ADVISOR_PROMPT = `You are a knowledgeable and friendly property advisor for Estatly, a premium London estate agency.

OUR PROPERTIES:
${propertySummary}

YOUR ROLE:
- Help buyers and renters find their perfect London property
- Recommend specific properties by name and ID from our listings above
- Answer questions about London areas, property types, and the buying/renting process
- Be warm, professional, and knowledgeable about London property
- Keep responses concise — 3-5 sentences
- Always reference specific property IDs when recommending

RULES:
- Only discuss properties from our listings above
- Never make up properties
- If asked about something unrelated to property, politely redirect`;

export async function getPropertyAdvice(messages) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: ADVISOR_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!response.ok) throw new Error("AI request failed");
  const data = await response.json();
  return data.content[0].text;
}

export async function generatePropertyDescription(property) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [{
        role: "user",
        content: `Write a professional estate agent property listing description for this London property. Make it compelling, aspirational, and use estate agent language. Keep it to 3 short paragraphs.

Property: ${property.title}
Type: ${property.propertyType}
Bedrooms: ${property.bedrooms}
Bathrooms: ${property.bathrooms}
Area: ${property.area}
Size: ${property.sqft} sqft
Price: ${property.type === "rent" ? "£" + property.pricePerMonth + " per month" : "£" + property.price?.toLocaleString()}
Key features: ${property.features.join(", ")}`,
      }],
    }),
  });
  if (!response.ok) throw new Error("AI request failed");
  const data = await response.json();
  return data.content[0].text;
}

export async function nlpPropertySearch(query) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: `Extract property search filters from this natural language query. Return ONLY a JSON object with these optional fields: minPrice, maxPrice, minPricePerMonth, maxPricePerMonth, minBedrooms, type (sale or rent), area (must be one of: Knightsbridge, Chelsea, Shoreditch, Notting Hill, Canary Wharf, Brixton, Richmond, Islington, Mayfair, Bermondsey, Hampstead, Clapham, Battersea, Wimbledon, Fulham, Kensington, Hackney, Chiswick, Wapping, Highgate).

Query: "${query}"

Return only valid JSON, nothing else.`,
      }],
    }),
  });
  if (!response.ok) throw new Error("AI request failed");
  const data = await response.json();
  try {
    return JSON.parse(data.content[0].text);
  } catch {
    return {};
  }
}