import OpenAI from "openai"

const openai = new OpenAI({
 apiKey: process.env.DASHSCOPE_API_KEY,
 baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
})


const translate = async (content: string,targetLanguage: string) => {
    const translation_options = {
        source_lang: "auto",
        target_lang: targetLanguage,
    }

   const response = await openai.chat.completions.create({
    model: "qwen-mt-plus",
    messages: [{role: "user", content: content}],
    // @ts-ignore
    translation_options
   })
   return response.choices[0].message.content
}

export async function POST(request: Request) {
    const {content, targetLanguage} = await request.json()
    const result = await translate(content, targetLanguage)
    return Response.json(result)
}