<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img class="the_img" src="../../assets/images/avatar.jpg" alt="" />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    // 选择图片=》  的点击事件
    chooseImg () {
      // 目的：为了让input[type=file]标签，让他再用JS代码来触发它的点击事件（）导致他
      // 默认行为给一个文件选择窗口
      // 原因：input[type=file]它是原生标签，样式不太好改
      // 解决：移花接木

      this.$refs.iptRef.click()
    },
    // 选择图片确定了
    onFileChange (e) { // e 原生的事件对象
      const files = e.target.files // 拿到用户选择的文件数组
      if (files.length === 0) {
        // 证明刚刚文件选择窗口打开了，但是他一个文件都没选择，点击了确认关闭窗口
      } else {
        // 证明看他选择了文件（默认只能选一个，但是如果选择多个需要给input标签加额外的原生熟悉）
        console.log(files[0])
      }
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img{
    width: 350px;
    height: 350px;
}
</style>
