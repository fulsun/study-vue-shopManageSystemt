<template>
  <el-container class="homeContainer">
    <!--     头部区域-->
    <el-header>
      <div>
        <img src="../assets/logo.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--      页面主体区域-->
    <el-container>
      <!--        侧边栏
      el-menu: 最外层的菜单容器
      el-menu-item：容器的子类，属性：disabled
      el-submenu: 下一层的菜单容器
        - 可使用 el-menu-item，el-submenu 继续嵌套
      el-menu-item-group:分组展示
        - 使用el-menu-item 进行标记
      -->
      <el-aside width="200px">
        <el-menu
          background-color="#353545"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="1">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </el-menu-item>
          <!--   一级菜单-->
          <el-submenu index="2">
            <!--            菜单的模版区域-->
            <template slot="title">
              <!-- 图标-->
              <i class="el-icon-location"></i>
              <!--              文本-->
              <span>一级菜单栏</span>
            </template>
            <el-menu-item>
              <i></i>
              <span></span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--        内容区-->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    logout() {
      // 清理 token 返回登录页面
      window.sessionStorage.clear();
      this.$router.push('/login');
    }
  }
};
</script>
<style lang="less" scoped>
  .homeContainer {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #ffffff;
    font-size: 22px;

    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        padding-left: 10px;
      }

      img {
        height: 60px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
  }

  .el-main {
    background-color: #dddddd;
  }
</style>
