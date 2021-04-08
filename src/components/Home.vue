<template>
  <div>
    home组件
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      // 清理 token 返回登录页面
      window.sessionStorage.clear()
      this.$router.push("/login")
    }
  }
}
</script>
<style lang="less" scoped>
</style>
