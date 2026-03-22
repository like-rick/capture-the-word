<script setup lang="ts">
import { ref } from 'vue';
import PictureCard from './components/PictureCard.vue';

const word = ref('');
const audio = ref('');
const sentence = ref('');
const audioUrl = ref('');

const detailExpand = ref(false);

const explanation = ref([]);
const expReply = ref([]);

const update = async (imageData: string) => {

  const endpoint = 'http://localhost:3000/analyzeImage';
  const headers = {
    'Content-Type': 'application/json',
  };

  word.value = '分析中...';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      image: imageData,
    })
  });

  const data = await response.json();
  const replyData = JSON.parse(data.text);
  word.value = replyData.representative_word;
  sentence.value = replyData.example_sentence;
  explanation.value = replyData.explanation.split('\n').filter((item: any) => item!== '');
  expReply.value = replyData.explanation_replys;
};

const submit = async (imageData: string) => {
  update(imageData);
};


const playCaptureAudio = async (text: string, prompt = "温柔女声") => {
    try {
        // 1. 发起 POST 请求
        const response = await fetch('http://localhost:3000/generateAudio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 将参数放在 body 中
            body: JSON.stringify({ text, prompt }),
        });

        // 2. 检查响应状态
        if (!response.ok) {
            // 如果后端返回的是 JSON 错误信息，需要特殊处理读取
            const errorData = await response.json();
            throw new Error(errorData.error || '语音合成失败');
        }

        // 3. 关键：将响应流转换为 Blob (Binary Large Object)
        // 这一步对应后端发送的 'audio/mpeg'
        const audioBlob = await response.blob();

        // 4. 创建一个指向内存中该 Blob 的临时 URL (Object URL)
        const audioUrl = URL.createObjectURL(audioBlob);

        // 5. 使用原生 Audio 对象播放
        const audio = new Audio(audioUrl);
        
        // 性能优化：播放结束后立即释放内存，防止大量单词查询导致内存溢出
        audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            console.log('音频播放完毕，内存已释放');
        };

        await audio.play();

    } catch (error: any) {
        console.error('音频处理出错:', error.message);
    }
};
</script>

<template>
  <div class="container">
    <PictureCard @update-image="submit" :word="word"/>
    <div class="output">
      <div>{{ sentence }}</div>
      <button v-if="sentence" @click="playCaptureAudio(sentence)">🔊</button>
      <div class="details">
        <button @click="detailExpand = !detailExpand">Talk about it</button>
        <div v-if="!detailExpand" class="fold"></div>
        <div v-else class="expand">
          <div class="explanation" v-for="item in explanation">
            <p>{{ item }}</p>
          </div>
          <div class="reply" v-for="item in expReply">
            <p>{{ item }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  font-size: .85rem;
  background: linear-gradient(180deg, rgb(235, 189, 161) 0%, rgb(71, 49, 32) 100%);
}

#selecteImage {
  display: none;
}

.input {
  width: 200px;
}

.output {
  margin-top: 20px;
  /* min-height: 300px; */
  width: 80%;
  text-align: center;
  font-weight: bold;
}

.preview img {
  max-width: 100%;
}

button {
  padding: 0 10px;
  margin-left: 6px;
}

.details {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.details button {
  background-color: black;
  color: white;
  width: 160px;
  height: 32px;
  border-radius: 8px 8px 0 0;
  border: none;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}
.details .fold {
  width: 200px;
  height: 30px;
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.details .expand {
  width: 200px;
  height: 88vh;
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.expand img {
  width: 60%;
  margin-top: 20px;
  border-radius: 6px;
}
.expand .explanation {
  color: black;
  font-weight: normal;
}
.expand .explanation {
  margin: 0 10px 10px 10px;
}
.expand .reply {
  color: black;
  font-weight: normal;
  margin-top: 20px;
}
.expand .reply p {
  padding: 4px 10px;
  margin: 0 10px 10px 10px;
  border-radius: 6px;
  border: solid 1px grey;
}
</style>