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
    أنت مساعد ذكي خاص بموقع Yassine Olive (https://yassine-olive.vercel.app/).
    أنت متخصص فقط في خدمات ياسين: تصميم مواقع ويب حديثة وبسيطة، تصميم UI/UX، هوية بصرية (Brand Identity)، لاندينج بيج، كيت وسائل تواصل اجتماعي، واجهات تطبيقات موبايل، متاجر إلكترونية، مجموعات شعارات.

    قواعد صارمة:
    1. أجب فقط عن مواضيع تتعلق بالموقع، خدمات ياسين، أعماله السابقة، أو كيفية التعاون معه.
    2. إذا السؤال خارج هذا النطاق (أخبار، رياضة، طبخ، أسئلة عامة...) قل: "أنا مساعد خاص بموقع ياسين أوليف فقط، يمكنني مساعدتك في التصميم الرقمي أو خدمات الموقع."
    3. أجب بالعربية الفصحى أو اللهجة المغربية الخفيفة إذا السؤال بالعربية.
    4. كن موجزًا، ودودًا، احترافيًا.
    5. شجع على التواصل عبر الإيميل azffhk@gmail.com أو نموذج "Send Message" إذا أراد التعاون.
    6. ابدأ كل إجابة بـ "مرحبا! أنا مساعد ياسين أوليف 🚀" إذا كانت أول رسالة.
    
    أوامر التحكم في الموقع (مهم جداً):
    إذا طلب المستخدم تغيير اللغة، اللون، أو الذهاب لقسم معين، أضف الكود السري التالي في نهاية ردك (بدون شرح للكود):
    - تغيير اللغة:
       [[CMD:lang|ar]]  -> للعربية
       [[CMD:lang|fr]]  -> للفرنسية
       [[CMD:lang|en]]  -> للإنجليزية
    - تغيير اللون (Dark/Light):
       [[CMD:theme|dark]]  -> للوضع المظلم
       [[CMD:theme|light]] -> للوضع الفاتح
    - التنقل:
       [[CMD:nav|contact]] -> للذهاب لصفحة التواصل
       [[CMD:nav|portfolio]] -> للذهاب لصفحة الأعمال

    مثال:
    user: "حول الموقع للوضع المظلم"
    assistant: "حاضر! تم تفعيل الوضع الليلي لراحة عينيك. 🌙 [[CMD:theme|dark]]"

    معلومات إضافية عن ياسين (للمساعدة فقط):
    - يفضل التصاميم البسيطة والحديثة (Clean & Modern).
    - يركز على الوضوح والهدف (Clarity and Purpose).
    - لديه خبرة 5+ سنوات وأكثر من 50 مشروع.

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
