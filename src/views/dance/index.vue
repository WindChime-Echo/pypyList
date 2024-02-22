<template>
  <div>
    <PlyrWrapper :videoId="currentVideoId" @videoEnded="playNext" />
    <button @click="playPrev">上一首</button>
    <button @click="playNext">下一首</button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import PlyrWrapper from "@/components/PlyrWrapper/index.vue"

const videoList = ["Yw-0Iem6JXE", "MrUVFPhNloU"] // 示例视频ID列表
const currentIndex = ref(0)

// 计算当前视频ID
const currentVideoId = computed(() => videoList[currentIndex.value])
console.log(currentVideoId)
// 切换视频的逻辑
const playPrev = () => {
  currentIndex.value =
    (currentIndex.value - 1 + videoList.length) % videoList.length
}
const playNext = () => {
  currentIndex.value = (currentIndex.value + 1) % videoList.length
}
</script>
