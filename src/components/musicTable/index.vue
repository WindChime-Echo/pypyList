<template>
  <div class="list">
    <el-table :data="tableData" style="width: 100%" height="800">
      <el-table-column fixed prop="id" label="ID" width="150" />
      <el-table-column prop="name" label="曲名" min-width="340" />
      <el-table-column prop="url" label="播放" width="120">
        <template #default="scope">
          <el-button :icon="VideoPlay" circle @click="openVideo(scope.row.id)" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="设置" width="200">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="collection(scope.row)">{{ scope.row.collection === 0 ?
            '收藏' : '取消收藏' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" v-model:current-page="pageNum" v-model:page-size="pageSize"
      :page-sizes="[20, 40, 60, 100]" background layout="total, sizes, prev, pager, next, jumper" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>
<script setup>
import { ref, onUnmounted } from 'vue';
import { VideoPlay } from '@element-plus/icons-vue';
const emit = defineEmits(['emitPage', 'collection'])
const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  }
})
const pageNum = ref(1)
const pageSize = ref(20)
const handleSizeChange = (val) => {
  emit('emitPage', val, 'pageSize')
}
const handleCurrentChange = (val) => {
  emit('emitPage', val, 'pageNum')
}
// options
const collection = (row) => {
  emit('collection', row)
};

// video
let videoElement = null;
const openVideo = (id) => {
  // 创建一个新的 video 元素
  videoElement = document.createElement('video');

  // 设置视频的源
  videoElement.src = `https://jd.pypy.moe/api/v1/videos/${id}.mp4`;
  // 视频开始加载回调
  videoElement.onloadstart = async () => {

  };
  // 当视频准备就绪后，播放视频并尝试进入全屏模式
  videoElement.oncanplay = () => {
    videoElement.play();

    // 尝试进入全屏模式
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.mozRequestFullScreen) {
      // Firefox
      videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) {
      // IE/Edge
      videoElement.msRequestFullscreen();
    }
  };

  // 将 video 元素添加到 DOM
  document.body.appendChild(videoElement);
};

const handleFullscreenChange = () => {
  if (!document.fullscreenElement && !document.webkitIsFullScreen) {
    if (videoElement) {
      videoElement.pause();
      document.body.removeChild(videoElement);
      videoElement = null;
    }
  }
};

// 监听 fullscreenchange 和 webkitfullscreenchange 事件
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

// 在组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener(
    'webkitfullscreenchange',
    handleFullscreenChange
  );
});
</script>

<style scoped>
.pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
