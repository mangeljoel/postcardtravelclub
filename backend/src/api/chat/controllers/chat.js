'use strict';

/**
 * chat controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { Configuration, OpenAIApi } = require("openai");
const { OpenAI } = require('openai');
const { PromptTemplate } = require('langchain/prompts');
const { LLMChain } = require('langchain/chains');
const { ChatOpenAI } = require('langchain/chat_models/openai');
// const { OpenAI } = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });


const llm = new ChatOpenAI({
  temperature: 0.7,
  modelName: 'gpt-4',
  openAIApiKey: process.env.OPENAI_API_KEY,
  maxTokens: 700, 
});


module.exports = createCoreController('api::chat.chat', ({ strapi }) => ({

  async startchat(ctx) {
   const body = ctx.request.body;


    const Tone = `
Write in a warm, poetic, and reflective tone that invites the reader to slow down and reconnect with themselves and nature.
Use gentle, sensory-rich language and grounded elegance. Avoid salesy or generic phrases. Speak with intention and grace.
Let the words evoke calm, presence, and a sense of soulful discovery.
Example tone: "Here, you're invited to return to your natural state: nourished, radiant, and completely at ease."
`;

    // Template & context
    const context = `
${Tone}

You are a travel agent, who is going to answer user's query based on a stay and the experience of another user in that same stay
Stay Information:
${body.stay_context}

Experience Information:
${body.exp_context}
`;

    const promptTemplate = new PromptTemplate({
  template:`
You are a helpful and friendly travel assistant.

Your job is to answer the user's question about a specific travel experience, taking into account:
- The context of the stay (location, facilities, environment, etc.)
- The details of the experience (activities, requirements, availability, etc.)
- Speak in third person — refer to the stay or experience. Do not speak as the host or owner **(We do not own the services we)**.

Use the context provided to respond accurately, informatively, and in a conversational tone. 

=== Stay & Experience Context ===
{context}

=== User Question ===
{message}

=== Your Answer ===
-If the answer to the question is not available in the context, then answer it according to your knowledge, but do not make up any information.
**Keep the answers short and consistent but should accurately answer the users question, your messages must be short of around 400 characters **
`, 
inputVariables: ['context', 'message', 'user_info'],});

    const chain = new LLMChain({ llm, prompt: promptTemplate });
    const reply = await chain.invoke({
      context,
      message: body.message,
      user_info: body.user_info || ''
    });

    ctx.send({ reply: reply.text });

  },


  async suggestQuestions(ctx) {
    const { stay_context, exp_context } = ctx.request.body;

    const promptTemplate = PromptTemplate.fromTemplate(`
      You are a helpful travel assistant.

      Given the context of a stay and an experience, generate 4 specific, engaging, and non-generic questions that a user might ask. Use the details provided.

      === Stay Context ===
      {stay_context}

      === Experience Context ===
      {exp_context}

      Output the questions in a numbered list:
      1.
      2.
      3.
      4.
      `);

    const chain = new LLMChain({ llm, prompt: promptTemplate });

    const result = await chain.invoke({
      stay_context,
      exp_context: exp_context || 'None',
    });

    const lines = result.text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && /[a-zA-Z]/.test(line));

    const questions = lines
      .map((line) => line.replace(/^[1-4]\.\s*/, '').trim())
      .slice(0, 4);

    ctx.send({ questions });
  },

  


  async getDetailedInformation(ctx) {
    const { context } = ctx.request.body;
     
    const Tone = `
Write in a warm, poetic, and reflective tone that invites the reader to slow down and reconnect with themselves and nature.
Use gentle, sensory-rich language and grounded elegance. Avoid salesy or generic phrases.
Let the words evoke calm, presence, and a sense of soulful discovery.
Example tone: "Here, you're invited to return to your natural state: nourished, radiant, and completely at ease."
`;


    const promptTemplate = PromptTemplate.fromTemplate(`
      You are a travel experience storyteller.

      Given the following postcard story, tell the user more about it:

      {Tone}

      ONLY talk about the specific activity described in the story.
      Do not talk generically about the country or region.

      Postcard: {context}

      Output only the enriched experience insights and give in structured format with different sections like
      Hidden gems, interesting facts, cultural significance, travel tips and other things depending on the story and information you have. Tell more about it.
      Do not necessarily give the same sections as above, but make sure to give the information in a structured way.
      Use bold text for section headings, but keep the **same font size** throughout and always use emojis for engaging content

      **Elaborate generously but keep the total length under 1000 tokens**.
      **Include tags that are relevant to the postcard (eg, Hiking, Fishing, etc), keep them strictly related to the postcard, dont include generic tags like 'Experience, Adventure, etc'**
      Do **not** return the \`reply\` as a dictionary. Return everything in this JSON format:

      Return ONLY a **single JSON object** in this **exact structure** — no markdown, no explanation, no extra text. No triple backticks. Just raw JSON.
      {{
  "reply": "\\n**Hidden Gems🌟** The Royal Raven Suite, named after the Raven Crown of Bhutan.\\n\\n**Interesting Facts🔎** Zhiwaling Heritage is proud to be Bhutan's first hotel.\\n",
  "tags": ["Bhutanese Heritage", "Cultural Immersion", "Relaxation", "Luxury Stay", "Mountain Views", "Nature"]
}}

      `);

   const chain = new LLMChain({ llm, prompt: promptTemplate });
try {
  const rawResponse = await chain.invoke({
    context,
    Tone,
  });
 console.log("🧪 rawResponse:", rawResponse);
 
function extractAndParseJSON(text) {
  try {
    // Remove Markdown wrappers if any (like code blocks)
    let cleaned = text.trim()
      .replace(/^```(json)?/, '')  // Remove the opening markdown code block
      .replace(/```$/, '');         // Remove the closing markdown code block

    // Fix any unescaped characters in the JSON response
    // cleaned = cleaned.replace(/\\n/g, '\\\\n'); // Escape the newlines correctly for JSON parsing
    cleaned = cleaned.replace(/\r?\n|\r/g, '');  // Remove any other unwanted line breaks

    // Now extract JSON content
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start !== -1 && end !== -1 && end > start) {
      const jsonString = cleaned.slice(start, end + 1); // Extract JSON content

      // Try parsing the JSON string
      return JSON.parse(jsonString);
    } else {
      console.error("No valid JSON block found.");
      return null;
    }

  } catch (err) {
    // Log any errors that occur during the parsing process
    console.error("JSON parsing failed:", err.message);
    return null;
  }
}


// Extract and parse the JSON from the raw response text
const parsed = extractAndParseJSON(rawResponse?.text || '');

if (!parsed) {
  return ctx.send({ error: 'No valid JSON block found or parsing failed.' });
}
console.log("Parsed JSON:", parsed);
// Send the parsed data back as the response
ctx.send(parsed);


} catch (error) {
  console.error("Error in getDetailedInformation:", error);
  ctx.send({ error: 'An error occurred while generating detailed information.' });
}

  },

// async create(ctx) {
//     const { data } = ctx.request.body;

//     // some logic here
//     const response = await super.create(ctx);
//     // some more logic
  
//     return response;
//     // const completion = await openai.createCompletion({
//     //     model: "text-davinci-003",
//     //     prompt:"As a mindful traveller, write a 300 words article to inspire me about " + data.message + ", make the content inpsiring and impactful",
//     //     temperature: 0.9,
//     //     max_tokens: 1024,
//     //     top_p: 1,
//     //     frequency_penalty: 0.0,
//     //     presence_penalty: 0.6,
//     //     best_of: 1,
//     //     stop: [" Human:", " AI:"],    
//     // });
    
//     // console.log(completion.data)

//     // strapi.service("api::chat.chat").create({
//     //     data: {
//     //       message:  completion?.data?.choices?.[0].text,
//     //       type:'bot'
//     //     }
//     //   });


    
//     // return completion?.data?.choices?.[0].text;
  
// },

}));