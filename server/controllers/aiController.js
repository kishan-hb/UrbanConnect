const { OpenAI } = require('openai');
const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HUGGINGFACE_API_KEY
});

const SYSTEM_PROMPT_BASE = "You are UrbanConnect’s helpful assistant. Your job is to guide users through booking rides, using app features, and solving any problems they encounter. Always provide clear, step-by-step instructions. If you don’t know the answer or the issue is complex, politely suggest contacting UrbanConnect support.";

exports.handleAIAssistant = async (req, res) => {
    const { message, actions } = req.body;
    const actionsText = Array.isArray(actions) && actions.length
        ? `Here is what the user has done so far:\n${actions.map(a => '- ' + a).join('\n')}\n`
        : "";
    const SYSTEM_PROMPT = `${SYSTEM_PROMPT_BASE}\n${actionsText}`;

    try {
        const completion = await client.chat.completions.create({
            model: "moonshotai/Kimi-K2-Instruct-0905",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: message }
            ],
        });
        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error('AI assistant error:', error);
        res.status(500).json({ error: "AI assistant failed" });
    }
};