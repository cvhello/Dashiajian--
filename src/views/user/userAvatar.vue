<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img v-if="!avatar" class="the_img" src="../../assets/images/avatar.jpg" alt="" />
        <img v-else class="the_img" :src="avatar" alt="">
      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="uploadFn">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { updatedUserAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: '' // 保存图片链接/base64字符串
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

        // 目标：选择的图片文件，要给到img标签上做纯前端的预览
        // img标签的src值，只能是图片链接地址（外链：http：//开头，图片文件相对路径
        // 或者是图片的base64字符（而且字符串还必须data：image/png;base64,图片转base64字符串）
        //  解决方案1：文件=》内存临时地址（这个地址只能是js里内存里不能发给后台）
        // 语法：URL.careateObjectURL(文件)
        // 返回值：内存临时地址
        // this.avatar = URL.createObjectURL(files[0])

        // 解决方案2：文件=》base64字符串（此字符串是可以发给后台的）
        const fr = new FileReader()
        fr.readAsDataURL(files[0]) // 传入文件对象开始读
        fr.onload = (e) => { // onload等待把文件读成base64字符串后会触发onload事件函数
        // e.target.result的值就是读完的结果
          this.avatar = e.target.result // 赋予给变量，让他显示在img的src里
        }
      }
    },
    // 开始上传头像
    async uploadFn () {
      const { data: res } = await updatedUserAvatarAPI(this.avatar)
      if (res.code !== 0) return this.$message.error(res.message)
      //   更新头像成功
      this.$message.success(res.message)
      //   立刻让vuex里actions（获取用户信息的actions）再请求一次后台更新vuex的值
      this.$store.dispatch('getUserInfoActions')
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
