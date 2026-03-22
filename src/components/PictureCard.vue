<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['updateImage']);

// 初始图片为空
let imgUrl = ref('');

const props = defineProps({
    word: {
        type: String,
        default: '',
    },
    audio: {
        type: String,
        default: '',
    }
});

const updateImageData = async (e: Event): Promise<any> => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) {
    return;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = reader.result as string;
      console.log(`PictureCard data: ${data}`);
      imgUrl.value = data
      emit('updateImage', data);
      resolve(data);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};
</script>

<template>
  <div class="card">
    <input id="selecteImage" class="input" type="file" accept=".jpg, .jpeg, .png, .gif" @change="updateImageData" />
    <img v-if="imgUrl" :src="imgUrl"/>
    <label for="selecteImage" class="upload">{{imgUrl ? "点击更换图片" : "点击上传图片"}}</label>
    <div class="word" v-if="word">{{ props.word }}</div>
  </div>
</template>

<style scoped>
#selecteImage {
  display: none;
}
.card {
  border-radius: 8px;
  padding: 20px;
  margin-top: 40px;
  min-height: 280px;
  height: auto;
  min-width: 280px;
  box-shadow: rgb(63,38,21) 0 3px 0px 0;
  background-color: rgb(105,78,62);
  box-sizing: border-box;
}
.upload {
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.word {
  margin-top: 20px;
  font-size: 16px;
  color: rgb(255,255,255);
}
.playAudio {
  margin-top: 16px;
}

.playAudio img {
  cursor: pointer;
}
</style>