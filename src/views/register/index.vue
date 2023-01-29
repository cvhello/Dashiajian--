<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form ref="form" :model="form" >
        <el-form-item placeholder="请输入用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item placeholder="请输入密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item placeholder="请再次输入密码">
          <el-input v-model="form.repassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-reg" type="primary" @click="registerFn">注册</el-button>
          <el-link type="info">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 经验：
// 前端绑定数据对象属性名，可以直接给要调用的功能接口的参数名一致
// 好处：我可以直接把前端对象（带着同名的属性和前端的值）发给后台
export default {
  name: 'my-register',
  data () {
    return {
      form: {
        username: '', // 用户名
        password: '', // 密码
        repassword: '' // 确认密码
      }
    }
  },
  methods: {
    // 注册=》点击事件
    registerFn () {

    }
  }

}
</script>

<style lang="less" scoped>
.reg-container {
  background: url("../../assets/images/login_bg.jpg") center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;
    .title-box {
      height: 60px;
      background: url("../../assets/images/login_title.png") center no-repeat;
    }
    .btn-reg {
      width: 100%;
    }
  }
}
</style>
