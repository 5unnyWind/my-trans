import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
})

const translate = async (content: string, targetLanguage: string) => {
    const translation_options = {
        source_lang: "auto",
        target_lang: targetLanguage,
    }

    // @ts-ignore
    const response = await openai.chat.completions.create({
        model: "qwen-mt-plus",
        messages: [{ role: "user", content: content }],
        stream: true,
        // @ts-ignore
        translation_options
    })
    return response
}

export async function POST(request: Request) {
    try {
        const { content, targetLanguage } = await request.json()

        if (!content || !targetLanguage) {
            return new Response('Missing required parameters', { status: 400 });
        }

        const stream = await translate(content, targetLanguage)

        // 创建流式响应
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    let accumulatedText = '';

                    for await (const chunk of stream) {
                        const delta = chunk.choices[0]?.delta?.content || '';
                        if (delta) {
                            accumulatedText = delta;

                            const data = JSON.stringify({
                                text: accumulatedText,
                                completed: false
                            });

                            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
                        }
                    }

                    // 发送完成信号
                    const finalData = JSON.stringify({
                        text: accumulatedText,
                        completed: true
                    });
                    controller.enqueue(new TextEncoder().encode(`data: ${finalData}\n\n`));
                    controller.close();
                } catch (error) {
                    console.error('Translation stream error:', error);
                    controller.error(error);
                }
            }
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Translation error:', error);
        return new Response('Translation failed', { status: 500 });
    }
}