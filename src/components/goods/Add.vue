<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>

    </el-card>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  data() {
    return {};
  },
  created() {

  },
  computed: {},
  methods: {}
};
</script>

<style lang='less' scoped>
</style>
