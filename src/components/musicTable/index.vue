<template>
  <div class="list">
    <el-table :data="tableData" style="width: 100%" height="796" :row-class-name="tableRowClassName">
      <el-table-column prop="id" label="ID" width="150" />
      <el-table-column prop="url" label="播放" width="120">
        <template #default="scope">
          <el-button :icon="VideoPlay" circle @click="openVideo(scope.row.id)" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="曲名" min-width="340" />
      <el-table-column label="设置" width="200">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="collection(scope.row)">{{ scope.row.collection === 0 ?
            '收藏' : '取消收藏' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" v-model:current-page="pageNum" v-model:page-size="pageSize"
      :page-sizes="[20, 40, 60, 100]" background layout="total, sizes, prev, pager, next, jumper"
      :total="totalData.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>
<script setup>
import { ref } from 'vue';
import _ from 'lodash'
import { useCollectionStore } from "@/stores/collection";
import { VideoPlay } from '@element-plus/icons-vue';


const emit = defineEmits(['update:totalData', 'emitPage', 'collection'])
const props = defineProps({
  totalData: {
    type: Array,
    default: () => []
  },
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

const collectionStore = useCollectionStore();
// options
const collection = (row) => {
  const collectionTag = row.collection;
  const initRow = { ...row };
  delete initRow.collection;
  collectionTag === 0
    ? collectionStore.addCollection(initRow)
    : collectionStore.deleteCollection(initRow);
};

const reset = () => {
  pageNum.value = 1
  pageSize.value = 20
  emit('emitPage', pageSize.value, 'pageSize')
  emit('emitPage', pageNum.value, 'pageNum')
}
const successIndex = ref()
const findIndex = (index) => {
  const totalData = _.cloneDeep(props.totalData)
  !!successIndex.value ? totalData[successIndex.value].success = false : null
  successIndex.value = index
  totalData[index].success = true
  if (pageSize.value < (index + 1)) {
    pageNum.value = Math.ceil((index + 1) / pageSize.value)
    emit('emitPage', pageNum.value, 'pageNum')
  }
  emit('update:totalData', totalData)
}


const tableRowClassName = ({ row, rowIndex }) => {
  if (row.success === true) return 'success-row'
  return ''
}
// video
const openVideo = (id) => {
  // 设置视频的源
  const videoURL = `https://jd.pypy.moe/api/v1/videos/${id}.mp4`;

  // 创建一个新的窗口
  const win = window.open('', '_blank');

  // 写入包含 <video> 标签的 HTML
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <body>
      <video controls autoplay width="100%" height="100%">
        <source src="${videoURL}" type="video/mp4">
        您的浏览器不支持 HTML5 video 标签。
      </video>
    </body>
    </html>
  `);
};

defineExpose({
  reset,
  findIndex,
  pageNum,
  pageSize
})
</script>

<style scoped>
::v-deep .el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.pagination {
  margin-top: 12px;
  justify-content: flex-end;
}
</style>
