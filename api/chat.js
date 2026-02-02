module.exports = async (request, response) => {
    // 1. Handle CORS (Optional, good practice)
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    // 2. Only allow POST
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    // 3. Get API Key from Environment
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return response.status(500).json({ error: 'Server Configuration Error: Missing API Key' });
    }

    try {
        const { message, history } = request.body;

        // 4. Construct Messages
        const systemPrompt = `
    You are an AI assistant for Yassine, a Digital Creator & Designer.
    Your traits: Professional, helpful, concise, and friendly.
    
    Yassine's Services:
    - Website Design (UI/UX, Landing Pages)
    - Visual Design (Branding, Social Media Kits)
    - Digital Profiles
    
    Contact: azffhk@gmail.com, X: @Ya10nf.
    
    Instructions:
    - Answer questions about Yassine's work and services.
    - If the user asks in Arabic, MUST reply in Arabic.
    - Answering in the same language as the user is CRITICAL.
    - Keep responses short (max 3-4 sentences) unless asked for details.
    
    Current Date: ${new Date().toLocaleDateString()}
    `;

        // Format history for Groq (ensure roles are correct)
        const conversation = [
            { role: 'system', content: systemPrompt },
            ...(Array.isArray(history) ? history : []),
            { role: 'user', content: message }
        ];

        // 5. Call Groq API
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: conversation,
                max_tokens: 300,
                temperature: 0.7
            })
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.json();
            console.error('Groq API Error:', errorData);
            throw new Error(`Groq API Error: ${groqResponse.statusText}`);
        }

        const data = await groqResponse.json();
        const reply = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

        // 6. Return Response
        return response.status(200).json({ reply });

    } catch (error) {
        console.error('Handler Error:', error);
        return response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
