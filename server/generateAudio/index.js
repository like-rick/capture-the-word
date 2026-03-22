import 'dotenv/config';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

const API_KEY = process.env.GEMINI_API_KEY; // 确保你的 Key 开启了 Text-to-Speech API 权限
// 使用 Google 目前最成熟且便宜的 TTS 路径
const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:10808');

export const generateAudio = async ({ text, prompt = "清晰教学" }) => {
    
    // 映射逻辑：将你的 prompt 转化为 TTS 能理解的参数
    const isGentle = prompt.includes("温柔");
    
    const payload = {
        input: { text: text },
        voice: {
            // 'en-US-Journey-F' 是 2026 年最自然、最有 Gemini 感的声音
            // 如果是中文，请改用 'zh-CN-Standard-A' (最便宜) 或 'zh-CN-Wavenet-A'
            languageCode: text.match(/[\u4e00-\u9fa5]/) ? 'zh-CN' : 'en-US',
            name: text.match(/[\u4e00-\u9fa5]/) ? 'zh-CN-Standard-A' : 'en-US-Journey-F'
        },
        audioConfig: {
            audioEncoding: "MP3",
            speakingRate: isGentle ? 0.9 : 1.0, // 温柔通常语速稍慢
        }
    };

    try {
        const response = await axios.post(url, payload, { 
            httpsAgent: proxyAgent,
            timeout: 60000,
            headers: { 'Content-Type': 'application/json' }
        });

        // 标准 TTS 返回的是 audioContent 字段
        if (response.data.audioContent) {
            console.log("音频生成成功");
            return Buffer.from(response.data.audioContent, 'base64');
        } else {
            throw new Error("接口未返回 audioContent");
        }
    } catch (error) {
        // 打印详细错误信息，方便定位
        console.error("请求失败详情:", error.response?.data || error.message);
        throw error;
    }
}