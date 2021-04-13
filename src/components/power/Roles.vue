<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <!-- 添加角色按钮 -->
        <el-col>
          <el-button type="primary" @click="AddRoleDialogVisible =true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand"></el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="slot">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(slot.row.id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(slot.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--  添加角色对话框-->
    <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible" width="40%" @close='addRoleDialogClosed'>
      <el-form :model="addRoleForm" ref="addRoleFormRef" :rules="addRoleFormRules"
               label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList();
  },
  data() {
    return {
      // 所有角色列表
      rolesList: [],
      // 分配权限框
      setRightDialogVisible: false,
      // 权限列表
      rightsList: [],
      //  树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //   默认选中节点ID值
      defKeys: [],
      //   添加用户对话框
      AddRoleDialogVisible: false,
      // 添加角色表单
      addRoleForm: {},
      //   添加角色表单验证
      addRoleFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          }
        ]
      },
      //   编辑角色信息
      editRoleForm: {},
      editRoleDialogVisible: false,
      editRoleFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          }
        ]
      },
      //   当前即将分配权限的Id
      roleId: 0
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！');
      }
      this.rolesList = res.data;
    },
    // 添加角色对话框的关闭
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields();
    },
    // 添加角色
    addRoles() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('roles', this.addRoleForm);
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败！');
        }
        this.$message.success('添加角色成功！');
        this.AddRoleDialogVisible = false;
        this.getRolesList();
      });
    },
    // 编辑角色
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id);
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！');
      this.editRoleForm = res.data;
      this.editRoleDialogVisible = true;
    },
    editRoles() {
      this.$refs.editRoleFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return;
        const { data: res } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error('更新角色信息失败！');
        }
        // 隐藏编辑角色对话框
        this.editRoleDialogVisible = false;
        this.$message.success('更新角色信息成功！');
        this.getRolesList();
      });
    },
    // 删除角色
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除');
      }
      const { data: res } = await this.$http.delete('roles/' + id);
      if (res.meta.status !== 200) return this.$message.error('删除角色失败！');
      this.$message.success('删除用户成功！');
      this.getRolesList();
    }
  }
};
</script>
