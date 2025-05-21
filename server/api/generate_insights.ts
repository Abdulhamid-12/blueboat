import { OpenAI } from "openai";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client = new OpenAI({ apiKey: config.openaiApiKey });

  const body = await readBody(event);
  // Expecting body to have: distances, battery_statuses, locations, navigations, scaled_pressures, attitudes
  const {
    distances = [],
    battery_statuses = [],
    locations = [],
    navigations = [],
    scaled_pressures = [],
    attitudes = [],
  } = body || {};

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a data analyst. I will provide you with some data and you will generate insights from it.`,
        },
        {
          role: "user",
          content: `The data is as follows:\n\nDistances: ${JSON.stringify(distances)}\nBattery Statuses: ${JSON.stringify(battery_statuses)}\nLocations: ${JSON.stringify(locations)}\nNavigations: ${JSON.stringify(navigations)}\nScaled Pressures: ${JSON.stringify(scaled_pressures)}\nAttitudes: ${JSON.stringify(attitudes)}`,
        },
      ],
    });
    return { result: response.choices[0].message.content };
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { error: error.message || "Failed to generate insights." };
  }
});
