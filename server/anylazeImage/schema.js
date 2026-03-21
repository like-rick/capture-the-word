import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
const responseSchema = z.object({
  // 对图片内容的详细中文描述
  image_discription: z.string().describe("对图片内容的详细中文描述"),
  
  // 最能代表图片的 A1-A2 级别英文单词
  representative_word: z.string().describe("最能代表图片的 A1-A2 级别英文单词"),
  
  // 包含代表单词的简单例句
  example_sentence: z.string().describe("包含代表单词的简单例句"),
  
  // 以 Look at 开头，每句后带换行符的解释
  explanation: z.string()
    .describe("以Look at开头，每句后带换行符的解释"),
    
  // 针对解释给出的两条互动回复
  explanation_replys: z.array(z.string())
    .length(2, "必须提供两条互动回复") // 显式约束数组长度为 2
    .describe("针对解释给出的两条互动回复"),
});

const geminiJsonSchema = zodToJsonSchema(responseSchema, { target: "openApi3" });

export {
    responseSchema,
    geminiJsonSchema
}
