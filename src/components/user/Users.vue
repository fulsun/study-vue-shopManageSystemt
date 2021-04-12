<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <!-- 搜索与添加区域一行有 24个 span-->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearSearch">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"> 添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" sortable></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="role_name" label="角色名"></el-table-column>
        <el-table-column label="状态">
          <!-- slot-scope="scope"   v-model="scope.row.mg_state" -->
          <template v-slot:default="slotprops">
            <el-switch
              v-model="slotprops.row.mg_state" @change="userStatuChange(slotprops.row)">
              disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="auto">
          <template v-slot="slot">
            <el-button type="primary" icon="el-icon-edit" round size="mini">{{slot.row.id}}</el-button>
            <el-button type="danger" icon="el-icon-delete" round size="mini"></el-button>
            <el-tooltip effect="light" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" round size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userList: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      dialogVisible: false,
      // 用户添加的表单数据
      addForm: {
        username: ''
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: '请填写用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        email: [{
          required: true,
          message: '请填写邮箱',
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请填写手机号',
          trigger: 'blur'
        }],
        password: [
          {
            required: true,
            message: '请填写密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12个字符',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return this.$message.error('用户列表获取失败');
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async userStatuChange(userInfo) {
      // 使用 ``用于字符串的拼接
      const { data: res } = await this.$http.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`);
      // console.log(res);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error('更新状态失败');
      }
      this.$message.success('更新状态成功');
    },
    clearSearch() {
      this.getUserList();
    },
    handleClose(done) {
      done();
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {
      //   });
    }
  }
}
;
</script>
<style lang="less" scoped>
  .el-table {
    margin-top: 20px;
  }

  .el-pagination {
    margin-top: 15px;
  }
</style>
