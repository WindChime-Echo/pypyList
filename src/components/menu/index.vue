<script setup>
import Setting from "@/components/setting/index.vue"
const emit = defineEmits(["change"])
const indexForUrl = ["/list", "/favorite", "/dance"]
const handleSelect = (Index) => {
  emit("change", indexForUrl[Index])
}

emit("change", indexForUrl[0])
</script>

<template>
  <el-menu class="el-menu" @select="handleSelect" default-active="0">
    <el-menu-item index="0">
      <el-icon>
        <HomeFilled />
      </el-icon>
      <span>列表</span>
    </el-menu-item>
    <el-menu-item index="1">
      <el-icon>
        <List />
      </el-icon>
      <span>收藏</span>
    </el-menu-item>
    <el-menu-item index="2">
      <el-icon><Expand /></el-icon>
      <span>跳舞</span>
    </el-menu-item>
    <Setting class="setting" />
  </el-menu>
</template>

<style scoped>
.el-menu {
  height: 100vh;
}
.setting {
  position: absolute;
  left: 40px;
  bottom: 40px;
}
</style>
