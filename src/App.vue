<script setup lang="ts">
import { ref } from 'vue';
import PictureCard from './components/PictureCard.vue';

const word = ref('请上传图片');
const audio = ref('');
const sentence = ref('');

const detailExpand = ref(false);

const explainations = ref([]);
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
  explainations.value = replyData.explaination.split('\n').filter((item: any) => item!== '');
  expReply.value = replyData.explaination_replys;
};

const submit = async (imageData: string) => {
  update(imageData);
};
</script>

<template>
  <div class="container">
    <PictureCard @update-image="submit" :word="word"/>
    <div class="output">
      <div>{{ sentence }}</div>
      <div class="details">
        <button @click="detailExpand = !detailExpand">Talk about it</button>
        <div v-if="!detailExpand" class="fold"></div>
        <div v-else class="expand">
          <div class="explaination" v-for="item in explainations">
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
.expand .explaination {
  color: black;
  font-weight: normal;
}
.expand .explaination p {
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