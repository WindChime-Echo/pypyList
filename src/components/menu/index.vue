<script setup>
const emit = defineEmits(['change'])
const indexForUrl = [
  '/list',
  '/favorite'
]
const handleSelect = (Index) => {
  emit('change', indexForUrl[Index])
}
</script>

<template>
  <el-menu default-active="0" class="el-menu" @select="handleSelect">
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
  </el-menu>
</template>

<style scoped>
.el-menu {
  height: 100vh;
}
</style>
