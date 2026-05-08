import { OpenAI } from 'openai';

export const askAI = async (message, contextData) => {
  let token = import.meta.env.VITE_AI_TOKEN;
  if (!token) throw new Error('AI Token is missing');

  const client = new OpenAI({
    baseURL: 'https://router.huggingface.co/v1',
    apiKey: token,
    dangerouslyAllowBrowser: true // Required for running OpenAI SDK in the browser
  });

  const systemPrompt = `You are a strict, restricted dashboard assistant. 
1. You can ONLY answer using the provided dashboard data context. 
2. Never use outside knowledge. 
3. If the answer does not exist in the dashboard context, you must reply EXACTLY and ONLY with the phrase: "I do not have that information in the dashboard data." Do not add any other sentences, explanations, or answers to the user's question.

CONTEXT:
${JSON.stringify(contextData)}`;

  try {
    const chatCompletion = await client.chat.completions.create({
      model: 'mistralai/Mistral-7B-Instruct-v0.2:featherless-ai',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 200,
      temperature: 0.1
    });

    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};
