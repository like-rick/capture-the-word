import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { anylazeImage } from './anylazeImage/index.js';
import { generateAudio } from './generateAudio/index.js';

const app = express();
app.use(express.json({ limit: '20mb' })); // 增大接收图片大小的限制
app.use(cors());


app.post('/analyzeImage', async (req, res) => {
    try {
        const { image } = req.body;
        const response = await anylazeImage(image);
        console.log(response)
        res.send(response);
    } catch (error) {
        console.error("请求失败:", error.response?.data || error.message);
        res.status(500).send({ error: '分析失败，请检查控制台日志' });
    }
});

app.post('/generateAudio', async (req, res) => {
    try {
        const { text, prompt } = req.body;
        console.log(text)
        const audioContent = await generateAudio({ text, prompt });
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioContent.length,
            'Access-Control-Expose-Headers': 'Content-Length',
            'Accept-Ranges': 'bytes',
        });
        res.send(audioContent); // 直接发送二进制 Buffer
    } catch (error) {
        console.error("请求失败:", error.response?.data || error.message);
        res.status(500).send({ error: '生成音频失败，请检查控制台日志' });
    }
})

app.listen(3000, () => console.log('🚀 服务已启动: http://localhost:3000'));