<template>
  <div>
    <div ref="videoContainer" v-html="videoHtml"></div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from "vue"
import Plyr from "plyr"
import "plyr/dist/plyr.css"

// 通过 defineProps 接收外部传入的 videoId
const props = defineProps({
  videoId: String,
})

const emit = defineEmits(["videoEnded"])

const videoContainer = ref(null)

const videoHtml = computed(() => {
  return `<div class="plyr__video-embed" data-plyr-provider="youtube" data-plyr-embed-id="${props.videoId}"></div>`
})

let plyrInstance = null

const initPlyr = async () => {
  await nextTick()
  if (plyrInstance) {
    plyrInstance.destroy()
  }
  if (videoContainer.value) {
    plyrInstance = new Plyr(
      videoContainer.value.querySelector(".plyr__video-embed"),
      {
        autoplay: true, // 尝试自动播放
      }
    )

    // 监听视频播放结束事件
    plyrInstance.on("ended", () => {
      // 触发父组件的事件，例如自动播放下一首
      emit("videoEnded")
    })
  }
}

// 监听 props.videoId 的变化来重新初始化 Plyr
watch(
  () => props.videoId,
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
