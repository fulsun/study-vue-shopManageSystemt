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
          <el-button type="primary" size="medium" :disabled="isBtnDisable" @click="addDialogVisible = true">添加参数
          </el-button>
          <el-table
            :data="manyTableData" border stripe
            style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}
                </el-tag>
                <!-- 组件上的事件绑定需要使用 native 修饰-->
                <el-input
                  class="input-new-tag"
                  v-show="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-show="!scope.row.inputVisible" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="medium" :disabled="isBtnDisable" @click="addDialogVisible = true"
          >添加属性
          </el-button>
          <el-table
            :data="onlyTableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}
                </el-tag>
                <!-- 组件上的事件绑定需要使用 native 修饰-->
                <el-input
                  class="input-new-tag"
                  v-show="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-show="!scope.row.inputVisible" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 编辑参数对话框 -->
    <el-dialog
      :title=" '修改' + getTitleText()"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="100px">
        <el-form-item :label="getTitleText()" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title=" '添加' + getTitleText()"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item :label="getTitleText()" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
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
    getTitleText() {
      if (this.activeTabsName === 'many') {
        return '动态参数';
      }
      return '静态属性';
    },
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
        // console.log(res.data);
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
    },
    // 显示编辑对话框
    async showEditDialog(attrId) {
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId()}/attributes/${attrId}`,
        {
          params: { attr_sel: this.activeTabsName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败！');
      }
      this.editFrom = res.data;
      this.editDialogVisible = true;
    },
    // 重置修改表单
    editDialogClosed() {
      this.$refs.editFromRef.resetFields();
    },
    // 修改参数
    editParams() {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.getCateId()}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeTabsName
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！');
        }
        this.$message.success('修改参数成功！');
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    // 根据Id删除对应的参数项
    async removeParams(attrId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！');
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.getCateId()}/attributes/${attrId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！');
      }
      this.$message.success('删除参数成功！');
      this.getParamsData();
    },
    // 监听对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFromRef.resetFields();
    },
    // 添加参数
    addParams() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.getCateId()}/attributes`,
          {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeTabsName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！');
        }
        this.$message.success('添加参数成功！');
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    // 删除对应的参数可选项:使用更新来删除操作
    handleClose(i, row) {
      // splice() 从数组中删除(下标为 i)，然后返回被删除的项目。0表示不删除
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    // 将对attr_vals（Tag） 的操作 保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.getCateId()}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！');
      }
      this.$message.success('修改参数项成功！');
    },
    // 点击按钮显示输入框
    showInput(row) {
      row.inputVisible = true;
      //   让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      // 页面是异步重置渲染，没渲染元素就获取 focus 焦点会报错，
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 文本框失去焦点,或者按下Enter触发
    handleInputConfirm(row) {
      // 输入的内容为空时，清空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = '';
      row.inputVisible = false;
      // 提交数据库，保存修改
      this.saveAttrVals(row);
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

<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0px;
  }

  .input-new-tag {
    width: 120px;
  }
</style>
