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
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"> 添加用户</el-button>
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
              v-model="slotprops.row.mg_state">
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
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userList: []
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('/users?pagenum=1&pagesize=10');
      if (res.meta.status !== 200) return this.$message.error('用户列表获取失败');
      this.userList = res.data.users;
    }
  }
}
;
</script>
<style lang="less" scoped>
  .el-table {
    margin-top: 20px;
  }
</style>
