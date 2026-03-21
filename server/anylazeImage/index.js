import 'dotenv/config';
import axios from 'axios';
import { responseSchema, geminiJsonSchema } from './schema.js';
import { userPrompt } from './prompt.js'
import { HttpsProxyAgent } from 'https-proxy-agent';


const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash-lite"; // 使用稳定版模型
const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
// 设置代理
const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:10808');
/**
 * 处理 Base64 图片字符串
 * @param {string} base64Str - 完整的 Base64 字符串 (例如: data:image/jpeg;base64,...)
 * @returns {object} 包含 imgType 和 data 的对象
 */
function parseBase64Image(base64Str) {
  // 使用正则表达式匹配 data:[MIME类型];base64,[数据部分]
  const regex = /^data:([^;]+);base64,(.+)$/;
  const matches = base64Str.match(regex);

  if (!matches || matches.length !== 3) {
    throw new Error("无效的 Base64 字符串格式");
  }

  return {
    imgType: matches[1], // 对应正则表达式第一个括号：MIME类型
    data: matches[2]    // 对应正则表达式第二个括号：纯数据部分
  };
}

export const anylazeImage = async (image) => {
    const { imgType, data } = parseBase64Image(image);
    
    const payload = {
        contents: [{
            parts: [
                { text: `${userPrompt}` },
                { inline_data: { mime_type: imgType, data } }
            ]
        }],
        // 解决模型幻觉，不按照想要的格式输出
        // 通用解决方案：langchain 的output Parars
        // Instructor: 它的自动重试机制能节省你大量的调试时间。
        // Zod: 对输入prompt优化，对输出格式进行严格教研
        generationConfig: {
            response_mime_type: "application/json", // 必须设为 json
            response_schema: geminiJsonSchema,        // 注入我们定义的 Schema
            temperature: 0.1,                       // 调低随机性，更稳定
        }
    };
    
    // 发送请求，明确指定 httpsAgent
    console.log(`url: ${url}`)
    const response = await axios.post(
        url, 
        payload, 
        { 
            httpsAgent: proxyAgent,
            timeout: 60000,
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    const content = response.data.candidates[0].content.parts[0];
    return content;
}
// 解析返回结果