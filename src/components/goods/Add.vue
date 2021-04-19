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
      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="true"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab 栏-->
        <el-tabs tab-position="left" v-model="activeIndex"
                 :before-leave="beforeTabLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  data() {
    const validateNum = (rule, value, callback) => {
      if (Number.isInteger(Number(value)) && Number(value) > 0) {
        callback();
      } else {
        callback(new Error('请输入大于0的整数'));
      }
    };
    return {
      activeIndex: 0,
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格,大于 0 且不能为负数',
            trigger: 'blur',
            validator: validateNum
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量,大于 0 且不能为负数',
            trigger: 'blur',
            validator: validateNum
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量,大于 0 且不能为负数',
            trigger: 'blur',
            validator: validateNum
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类,大于 0 且不能为负数',
            trigger: 'blur'
          }
        ]
      },
      // 商品列表
      cateList: [],
      // 级联选择器配置
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      a: ''
    };
  },
  created() {
    this.getCateList();
  },
  computed: {},
  methods: {
    // 获取商品分类数据列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！');
      }
      this.cateList = res.data;
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        this.$message.error('只能选择三级的分类');
      }
    },
    beforeTabLeave(activeName, odlActiveName) {
      // 未选中商品分类阻止Tab标签跳转
      if (odlActiveName === '0' && (this.addForm.goods_name.trim() === '' || this.addForm.goods_price <= 0 ||
        this.addForm.goods_weight <= 0 || this.addForm.goods_number <= 0)) {
        this.$message.error('请按要求填写数据');
        return false;
      }
      if (odlActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类');
        return false;
      }
    }
  }
};
</script>

<style lang='less' scoped>

</style>
