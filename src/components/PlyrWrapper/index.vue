<!-- <template>
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
  flip: {
    type: Boolean,
    default: false,
  },
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
      autoplay: true,
      fullscreen: {
        enabled: true,
      },
    })

    // 根据 flip 属性应用翻转效果
    const videoElement = videoContainer.value.querySelector("video")
    if (props.flip) {
      videoElement.style.transform = "scaleX(-1)"
    } else {
      videoElement.style.transform = "scaleX(1)"
    }

    plyrInstance.on("ended", () => {
      emit("videoEnded")
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
</script> -->
<template>
  <div>
    <video ref="plyrVideo" controls class="plyr__video-embed">
      <source :src="props.videoUrl" type="video/mp4" />
    </video>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue"
import Plyr from "plyr"
import "plyr/dist/plyr.css"

const props = defineProps({
  videoUrl: String,
  flip: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["videoEnded"])
const plyrVideo = ref(null)

let plyrInstance = null

// 定义静音然后延迟取消静音的函数
const muteAndUnmuteAfterDelay = (delay = 1000) => {
  if (plyrInstance) {
    plyrInstance.muted = true // 开始时静音
    setTimeout(() => {
      plyrInstance.muted = false // 延迟后取消静音
      plyrInstance.volume = 1 // 可选：同时设置音量为最大
    }, delay)
  }
}

const initPlyr = () => {
  nextTick(() => {
    if (plyrInstance) {
      plyrInstance.destroy()
    }
    if (plyrVideo.value) {
      plyrInstance = new Plyr(plyrVideo.value, {
        autoplay: true,
      })

      plyrInstance.on("ended", () => {
        emit("videoEnded")
      })

      muteAndUnmuteAfterDelay() // 初始化 Plyr 后调用静音/取消静音逻辑

      applyFlipEffect()
    }
  })
}

const applyFlipEffect = () => {
  if (props.flip) {
    plyrVideo.value.style.transform = "scaleX(-1)"
  } else {
    plyrVideo.value.style.transform = "scaleX(1)"
  }
}

watch(
  () => props.videoUrl,
  (newVal) => {
    if (plyrInstance && newVal) {
      plyrInstance.source = {
        type: "video",
        sources: [
          {
            src: newVal,
            type: "video/mp4",
          },
        ],
      }
      muteAndUnmuteAfterDelay() // 当视频 URL 更新时再次应用静音/取消静音逻辑
    }
  },
  { immediate: true }
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
