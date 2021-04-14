<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table border :class="['treetable']"
                  :data="cateList.result"
                  :columns="columns"
                  :show-index="true"
                  index-text="#"
                  :show-row-hover='false'
                  :selection-type="false"
                  :expand-type="false">
        <!-- 是否有效 -->
        <template v-slot:isOk="scope">
          <i class="el-icon-success" v-show="scope.row.cat_deleted" style="color: lightgreen"></i>
          <i class="el-icon-error" v-show="!scope.row.cat_deleted" style="color: orangered"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-show="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-show="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-show="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除
          </el-button>
        </template>
      </tree-table>
      <!-- 分页区域-->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options：数据源 -->
          <!-- props：指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            filterable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      total: 0,
      cateList: [],
      addCateDialogVisible: false,
      // 添加分类对象
      addCateForm: {
        // 将要添加分类名称
        cat_name: '',
        // 分类父级id
        cat_pid: 0,
        // 分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 选中的父级Id数组
      selectedKeys: [],
      queryInfo: {
        type: [1, 2, 3],
        pagenum: 1,
        pagesize: 5
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 当前列 自定义模板
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          // 当前列 自定义模板
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // 当前列 自定义模板
          type: 'template',
          template: 'opt'
        }
      ],
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 配置触发选项 hover/click
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据列表失败！');
      }
      this.cateList = res.data;
      this.total = res.data.total;
    },
    // 监听页面展示数据
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听翻页动作
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 添加操作
    showAddCateDialog() {
      // 先获取父级分类数据
      this.getParentCateList();
      // 再打开对话框
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        // 获取前 2 级的分类
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败！');
      }
      this.parentCateList = res.data;
    },
    // 添加分类关闭时候重置表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    // 添加分类 选择项发生变化触发
    parentCateChanged() {
      console.log(this.selectedKeys);
      // 如何selectKeys 数组的长度>0 说明选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length;
        return 0;
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0;
        // 当前分类的等级
        this.addCateForm.cat_level = 0;
      }
    },
    // 添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('categories', this.addCateForm);
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！');
        }

        this.$message.success('添加分类成功！');
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    }
  }
};
</script>
<style lang="less">
  .treetable {
    margin-top: 15px;;
  }

  .el-cascader-panel {
    height: 200px
  }
</style>
