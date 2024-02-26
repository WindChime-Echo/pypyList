<template>
  <div>
    <div ref="videoContainer" v-html="videoHtml"></div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from "vue"
import Plyr from "plyr"
import "plyr/dist/plyr.css"

// 通过 defineProps 接收外部传入的视频链接
const props = defineProps({
  videoUrl: String, // 修改为接收视频URL
})

const emit = defineEmits(["videoEnded"])

const videoContainer = ref(null)

// 修改计算属性以返回视频标签，包含传入的视频URL
const videoHtml = computed(() => {
  return `<video controls class="plyr__video-embed"><source src="${props.videoUrl}" type="video/mp4"></video>`
})

let plyrInstance = null

const initPlyr = async () => {
  await nextTick()
  if (plyrInstance) {
    plyrInstance.destroy()
  }
  if (videoContainer.value) {
    plyrInstance = new Plyr(videoContainer.value.querySelector("video"), {
      autoplay: true, // 尝试自动播放
    })

    // 监听视频播放结束事件
    plyrInstance.on("ended", () => {
      emit("videoEnded") // 触发父组件的事件，例如自动播放下一首
    })
  }
}

// 监听 props.videoUrl 的变化来重新初始化 Plyr
watch(
  () => props.videoUrl,
  () => {
    initPlyr()
  }
)

onMounted(() => {
  initPlyr()
})

onUnmounted(() => {
  if (plyrInstance) {
    plyrInstance.destroy()
  }
})
</script>
