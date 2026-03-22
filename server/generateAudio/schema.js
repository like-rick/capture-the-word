import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
const responseSchema = z.object({
  // 语音内容的详细描述的url连接
  audio_url: z.string().describe("对语音内容的详细描述的url连接"),
});

const geminiJsonSchema = zodToJsonSchema(responseSchema, { target: "openApi3" });

export {
    responseSchema,
    geminiJsonSchema
}
