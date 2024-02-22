<template>
  <div class="list">
    <el-table
      :data="tableData"
      style="width: 100%"
      height="84vh"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="avatar" label="封面" width="80" align="center">
        <template #default="scope">
          <el-avatar
            :size="65"
            :src="`https://img.youtube.com/vi/${extractVideoID(
              scope.row
            )}/hqdefault.jpg`"
          ></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="播放" width="120">
        <template #default="scope">
          <el-button :icon="VideoPlay" circle @click="openVideo(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="曲名" min-width="340" />
      <el-table-column label="设置" width="200">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="collection(scope.row)"
            >{{ scope.row.collection === 0 ? "收藏" : "取消收藏" }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[20, 40, 60, 100]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalData.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script setup>
import { ref } from "vue"
import _ from "lodash"
import { usePypyListStore } from "@/stores/pypyDance"
import { useCollectionStore } from "@/stores/collection"
import { VideoPlay } from "@element-plus/icons-vue"

const emit = defineEmits(["update:totalData", "emitPage", "collection"])
const props = defineProps({
  totalData: {
    type: Array,
    default: () => [],
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
})
const pageNum = ref(1)
const pageSize = ref(20)
const handleSizeChange = (val) => {
  emit("emitPage", val, "pageSize")
}
const handleCurrentChange = (val) => {
  emit("emitPage", val, "pageNum")
}

const collectionStore = useCollectionStore()
const pypyListStore = usePypyListStore()
// options
const collection = (row) => {
  const collectionTag = row.collection
  const initRow = { ...row }
  delete initRow.collection
  collectionTag === 0
    ? collectionStore.addCollection(initRow)
    : collectionStore.deleteCollection(initRow)
}

const extractVideoID = (row) => {
  const originalUrl = row.originalUrl[0]
  const regex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/

  const match = originalUrl.match(regex)
  return match ? match[1] : null
}
const reset = () => {
  pageNum.value = 1
  pageSize.value = 20
  emit("emitPage", pageSize.value, "pageSize")
  emit("emitPage", pageNum.value, "pageNum")
}
const successIndex = ref()
const findIndex = (index) => {
  const totalData = _.cloneDeep(props.totalData)
  !!successIndex.value ? (totalData[successIndex.value].success = false) : null
  successIndex.value = index
  totalData[index].success = true
  if (pageSize.value < index + 1) {
    pageNum.value = Math.ceil((index + 1) / pageSize.value)
    emit("emitPage", pageNum.value, "pageNum")
  }
  emit("update:totalData", totalData)
}

const tableRowClassName = ({ row, rowIndex }) => {
  if (row.success === true) return "success-row"
  return ""
}
// video
const openVideo = (row) => {
  // 跳转单独/油管逻辑
  const isYouTube = pypyListStore.isYouTube
  if (isYouTube) return window.open(row.originalUrl[0], "_blank")
  // 设置视频的源
  const id = row.id
  const videoURL = `https://jd.pypy.moe/api/v1/videos/${id}.mp4`
  console.log(videoURL)
  // 创建一个新的窗口
  const win = window.open("", "_blank")

  // 写入包含 <video> 标签的 HTML
  win.document.write(`
  <!DOCTYPE html>
  <html style="width:100%;height:100%;margin:0;padding:0;">
  <body style="width:100%;height:100%;margin:0;padding:0;overflow:hidden;">
    <video controls autoplay style="width:100%;height:100%;object-fit:cover;">
      <source src="${videoURL}" type="video/mp4">
      您的浏览器不支持 HTML5 video 标签。
    </video>
  </body>
  </html>
`)
}
defineExpose({
  reset,
  findIndex,
  pageNum,
  pageSize,
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
