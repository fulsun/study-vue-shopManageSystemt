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
      <!-- collapse-transition='true' 是否开启折叠动画 -->
      <el-aside :width="iscollpase? 'auto':'200px'">
        <div class="toggleButton" @click="toggleCallapse">|||</div>
        <!--             侧边栏菜单区域-->
        <el-menu
          :default-active="'/'+this.$route.path.split('/')[1]"
          :router="true"
          :collapse="iscollpase"
          :collapse-transition='false'
          :unique-opened="true"
          background-color="#353545"
          text-color="#fff"
          active-text-color="#409eff">
          <!--   一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!--            菜单的模版区域-->
            <template slot="title">
              <i :class="iconMap[item.id]"></i>
              <span v-text="item.authName">一级菜单栏</span>
            </template>
            <el-menu-item v-show="item.children !== null" v-for="subitem in item.children" :key="subitem.id"
                          :index="'/'+subitem.path.toString()">
              <i class="el-icon-s-grid"></i>
              <span v-text="subitem.authName">二级菜单</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--        内容区-->
      <el-main>
        <!-- 路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList();
  },
  data() {
    return {
      iscollpase: false,
      menulist: [],
      iconMap: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    };
  },
  methods: {
    logout() {
      // 清理 token 返回登录页面
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus');
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('菜单获取失败');
      this.menulist = res.data;
    },
    // 点击按钮切换菜单折叠与展开
    toggleCallapse() {
      this.iscollpase = !this.iscollpase;
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

    .toggleButton {
      background-color: #585166;
      color: #ffffff;
      font-size: 10px;
      line-height: 24px;
      text-align: center;
      letter-spacing: 0.5em;
      cursor: pointer;
    }

    // 隐藏展开后的一像素 border
    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #dddddd;
  }

  .iconfont {
    margin-right: 15px;
  }
</style>
