<template>
  <div>商品分类模块</div>
</template>
<script>
export default {
  data() {
    return {
      cateList: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //   获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据列表失败！');
      }
      this.cateList = res.data;
      console.log(res.data);
    }
  }
};
</script>
