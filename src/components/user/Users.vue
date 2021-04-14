<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
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
        <el-table-column label="操作" width="200px">
          <template v-slot="slot">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(slot.row)" round size="mini">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" round size="mini"
                       @click="deleteUser(slot.row.id)"></el-button>
            <el-tooltip effect="light" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" round size="mini"
                         @click="showAssign(slot.row)"></el-button>
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
      :before-close="handleClose"
      @close="addDiglogClosed">
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
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="editDiglogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateUser">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="showAssigndialog"
      width="50%"
      @close="assignRoleClose"
      :before-close="handleClose">
      <p>用户名：{{userInfo.username}}</p>
      <p>当前角色：{{userInfo.role_name}}</p>
      <el-select v-model="selectRoleId" placeholder="请选择">
        <el-option
          v-for="item in rolesList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showAssigndialog = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义检验规则
    // 验证邮箱的规则
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (regEmail.test(value)) {
        // 合法的输入
        return cb();
      }
      cb(new Error('清输入合法的邮箱!'));
    };
    // 验证手机号的规则
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
      if (regMobile.test(value)) {
        // 合法的输入
        return cb();
      }
      cb(new Error('清输入合法的手机号!'));
    };
    return {
      selectRoleId: '',
      userInfo: {},
      rolesList: [],
      showAssigndialog: false,
      editForm: {},
      userList: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      editDialogVisible: false,
      dialogVisible: false,
      // 用户添加的表单数据
      addForm: {
        id: null,
        username: '',
        mobile: '',
        email: '',
        password: ''
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
        }, {
          validator: checkEmail,
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请填写手机号',
          trigger: 'blur'
        }, {
          validator: checkMobile,
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
    },
    // 监听添加用户的取消按钮
    addDiglogClosed() {
      // 重置表单
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async(valiate) => {
        if (!valiate) return;
        // 预校验通过
        const { data: res } = await this.$http.post('users', this.addForm);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.dialogVisible = false;
        this.$message.success('添加成功');
        this.getUserList();
      });
    },
    editDiglogClosed() {
      // 重置表单的校验结果
      this.$refs.editFormRef.resetFields();
    },
    async showEditDialog(old) {
      this.editDialogVisible = true;
      this.addForm = old;
      const { data: res } = await this.$http.get(`users/${old.id}`);
      this.editForm = res.data;
    },
    updateUser() {
      this.$refs.editFormRef.validate(async(validate) => {
        if (!validate) return;
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, this.editForm);
        if (res.meta.status !== 200) return this.$message.error('更新失败');
        this.editDialogVisible = false;
        this.$message.success('更新成功');
        this.getUserList();
      });
    },
    async deleteUser(id) {
      const isdel = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => {
        return err;
      });
      // console.log(isdel);
      // 判读用户操作：confirm cancel
      if (isdel === 'confirm') {
        const { data: res } = await this.$http.delete('users/' + id);
        if (res.meta.status !== 200) return this.$message.error('删除失败!');
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getUserList();
      } else {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      }
    },
    async showAssign(userInfo) {
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！');
      }
      this.rolesList = res.data;
      this.showAssigndialog = true;
    },
    assignRoleClose() {
      this.selectRoleId = '';
    },
    // 分配角色
    async saveRoleInfo() {
      if (!this.selectRoleId) return this.$message.error('请选择要分配的角色');
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectRoleId
      });

      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败');
      }
      this.$message.success('更新角色成功');
      this.getUserList();
      this.showAssigndialog = false;
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
