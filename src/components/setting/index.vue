<template>
  <div class="setting">
    <el-dropdown>
      <el-button type="primary" size="large" :icon="Setting" circle />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="updateList">更新</el-dropdown-item>
          <el-dropdown-item @click="exportCollection">
            导出收藏
          </el-dropdown-item>
          <el-dropdown-item @click="importCollection">
            导入收藏
          </el-dropdown-item>
          <el-dropdown-item @click="jumpingMethod">
            切换为跳转{{ pypyListStore.isYouTube ? "单独页面" : "油管" }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <input
      type="file"
      ref="fileInput"
      @change="onFileChange"
      style="display: none"
    />
  </div>
</template>

<script setup>
import { usePypyListStore } from "@/stores/pypyDance"
import { Setting } from "@element-plus/icons-vue"
import { useCollectionStore } from "@/stores/collection"
import { ElMessage, ElMessageBox } from "element-plus"
import { ref } from "vue"
const pypyListStore = usePypyListStore()
const collectionStore = useCollectionStore()
function updateList() {
  pypyListStore.getPypyList(true)
}

function exportCollection() {
  collectionStore.exportCollection()
}

const fileInput = ref()

function importCollection() {
  ElMessageBox.confirm("导入收藏将删除原有收藏，是否确认？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      fileInput.value.click()
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消导入",
      })
    })
}

const jumpingMethod = () => {
  pypyListStore.editIsYouTuBe()
}

function onFileChange(e) {
  const file = e.target.files[0]
  const reader = new FileReader()
  function validateObj(obj) {
    const requiredKeys = [
      "id",
      "group",
      "volume",
      "name",
      "flip",
      "start",
      "end",
      "skipRandom",
      "originalUrl",
    ]
    for (const key of requiredKeys) {
      if (!(key in obj)) {
        return false
      }
    }
    return true
  }
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      data.forEach((item) => {
        if (!validateObj(item)) {
          ElMessage.error("JSON文件不符合对应格式")
          return
        }
      })
      collectionStore.importCollection(data)
    } catch (error) {
      ElMessage.error("请导入正确格式文件")
    }
  }

  reader.readAsText(file)
  location.reload()
}
</script>

<style scoped>
.setting {
}
</style>
