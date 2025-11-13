import { OpenAI } from 'openai'
import strapi from "../../../../src/queries/strapi";

// Initialize OpenAI SDK
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const fetchDxcardData = async (dxcardId) => {
    const { data } = await strapi.find("dx-cards", {
        filters: {
            id: dxcardId,
        },
        fields: ["name", "intro", "story"],
        populate: {
        },
    });
    if (!data) return null
    return data[0]
}

export default async function handler(req, res) {
    const { dxcardId } = req.query

    if (!dxcardId || typeof dxcardId !== 'string') {
        return res.status(400).json({ error: 'Invalid dxcardId' })
    }

    const data = await fetchDxcardData(dxcardId)

    if (!data) {
        return res.status(404).json({ error: 'DxCard not found' })
    }
    const { name, intro, story } = data

    const prompt = `
You are a travel experience storyteller.

Given the following postcard story, tell the user more about it:

ONLY talk about the specific activity described in the story.
Do not talk generically about the country or region.
Make the response engaging with emojis and avoid repeating the story itself.

Postcard: ${name}
Intro: ${intro}

Output only the enriched experience insights and give in structured format with different sections like
Hidden gems, interesting facts, cultural significance, travel tips and other things depending on the story and information you have. Tell more about it.
Do not necessarily give the same sections as above, but make sure to give the information in a structured way.
Do not add introduction or conclusion.
  `.trim()

    try {
        const chatResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // or 'gpt-3.5-turbo'
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
        })

        const responseContent = chatResponse.choices[0]?.message?.content

        if (!responseContent) {
            return res.status(500).json({ error: 'Failed to get a response from OpenAI' })
        }

        return res.status(200).json({
            dxcardId,
            detailedInfo: responseContent,
        })
    } catch (error) {
        console.error('OpenAI Error:', error)
        return res.status(500).json({ error: 'OpenAI API call failed' })
    }
}
