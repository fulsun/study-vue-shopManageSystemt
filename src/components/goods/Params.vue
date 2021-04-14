<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="true"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeTabsName" @tab-click="handleTabsClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="medium" :disabled="isBtnDisable">添加参数</el-button>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="medium" :disabled="isBtnDisable">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList();
  },
  data() {
    return { // 商品分类列表
      cateList: [],
      //   级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //   级联选择框双向绑定对象
      selectedCateKeys: [],
      //   激活页签名称
      activeTabsName: 'many',
      //   动态参数数据
      manyTableData: [],
      //   静态属性数据
      onlyTableData: [],
      //   控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      //   添加表单的数据对象
      addFrom: {
        attr_name: ''
      },
      //   添加表单的验证规则
      addFromRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      //   编辑对话框
      editDialogVisible: false,
      //   修改表单数据对象
      editFrom: {},
      //   修改表单验证规则
      editFromRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    // 当前选中的三级分类Id
    getCateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据列表失败！');
      }
      this.cateList = res.data;
    },
    // 级联选择框 选中变化 触发
    handleChange() {
      this.getParamsData();
    },
    // 获取参数的列表数据
    async getParamsData() {
      // 通过数组的长度判断
      if (this.selectedCateKeys.length === 3) {
        //   根据所选分类的Id,和当前面板的参数, 获取对应的参数
        const { data: res } = await this.$http.get(
          `categories/${this.getCateId()}/attributes`,
          {
            params: { sel: this.activeTabsName }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败！');
        }
        console.log(res.data);
        res.data.forEach(item => {
          //   通过三元表达式判断attr_vals是否为空
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];

          // 控制文本框的显示与隐藏
          item.inputVisible = false;
          // 文本框的输入值
          item.inputValue = '';
        });
        if (this.activeTabsName === 'many') {
          this.manyTableData = res.data;
        } else {
          this.onlyTableData = res.data;
        }
      } else {
        // 只允许选择三级分类：
        // 通过数组的长度判断
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = [];
          // 清空表格数据
          this.manyTableData = [];
          this.onlyTableData = [];
        }
      }
    },
    // Tab页签点击事件的处理函数
    handleTabsClick() {
      // first second
      // console.log(this.activeTabsName);
      this.getParamsData();
    }
  },
  computed: {
    // 不选择分类不让点击 tab 区域
    isBtnDisable() {
      return this.selectedCateKeys.length !== 3;
    }
  }
};
</script>

<style lang="less">
  .cat_opt {
    margin: 15px 0px;
  }
</style>
