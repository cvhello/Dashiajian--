<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img src="../../assets/images/logo.png" alt="" class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="quitFn"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
     <el-aside width="200px">
      <!-- 侧边栏 用户信息区域 -->
    <div class="user-box">
        <img v-if="user_pic" :src="user_pic" alt=""  />
        <img v-else src="../../assets/images/logo.png" alt=""  />
        <span>欢迎 {{ nickname || username }}</span>
    </div>
    <!-- 侧边栏的导航-菜单 -->
    <!--
      el-menu:导航菜单
      default-active:当前激活菜单的 index(el-submenu/el-menu-item的值)
    @open：sub-menu 展开的回调
    @close: sub-menu  关闭的回调
    active-text-color:激活时的颜色，哪项index的值和default-active一致，就会被设置动态文字颜色

    子标签：
    如果有嵌套，先写el-submenu (里面嵌套template#title的设置当前展示内容，子用el-menu-item展示)
    如果无嵌套，直接写el-menu-item
     -->
    <el-menu
      default-active="/home"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#23262E"
      text-color="#fff"
      active-text-color="#409EFF">

      <el-menu-item index="/home">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </el-menu-item>
      <el-submenu index="/topic">
        <template slot="title">
          <i class="el-icon-s-order"></i>
          <span>文章管理</span>
        </template>
         <el-menu-item index="/topic1">
        <i class="el-icon-s-home"></i>
        <span>文章1</span>
      </el-menu-item>
       <el-menu-item index="/topic2">
        <i class="el-icon-s-home"></i>
        <span>文章2</span>
      </el-menu-item>
      </el-submenu>
      <el-submenu index="/my">
        <template slot="title">
          <i class="el-icon-s-order"></i>
          <span>个人中心</span>
        </template>
         <el-menu-item index="/my1">
        <i class="el-icon-s-home"></i>
        <span>中心1</span>
      </el-menu-item>
       <el-menu-item index="//my2">
        <i class="el-icon-s-home"></i>
        <span>中心2</span>
      </el-menu-item>
      </el-submenu>
    </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          Main.vue后台主页
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// 经验 在组件标签上绑定的所有事件（包括原生事件的名字click,input等等）
// 都是自定义事件，都需要组件内$emit来触发才行
// 万一组件内不支持这个原生事件名字
// 解决：@事件名.native="methods里方法名"
// .native给组件内跟标签，绑定这个原生事件
import { mapGetters } from 'vuex'
export default {
  name: 'my-layout',
  computed: {
    ...mapGetters(['username', 'nickname', 'user_pic'])
  },
  methods: {
    // 退出登录=>点击事件
    quitFn () {
      this.$confirm('这就走了？不爱我了吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //    他选择了确定
        //   清除vuex
        this.$store.commit('updateToken', '')
        this.$store.commit('updateUserInfo', {})
        // 强制跳转登录页面
        this.$router.push('/login')
      }).catch(() => {
        // 他选择了取消
      })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
</style>
