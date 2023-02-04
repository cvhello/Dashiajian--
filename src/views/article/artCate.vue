<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click=" addCateShowDialogBtnFn"
          >添加分类</el-button
        >
      </div>
      <!-- 分类数据表格 -->
     <el-table style="width: 100%" :data="cateList" border stripe>
        <!-- type是table-column内置属性，你告诉他用index，意思就是第一个单元格用索引值 -->
      <el-table-column
          label="序号"
          type="index"
          width="100"
        ></el-table-column>
        <el-table-column prop="cate_name" label="分类名称" ></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini">修改</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加文章分类的对话框
    el-dialog 对话框组件
    title 左上角标题
    visible 控制对话框是否显示（右侧vue变量为true显示false隐藏）
    visible.sync:组件内检测到对话框关闭（点击蒙层，按ESC，按右上角X）他会回传false给右侧变量
before-close:对话框关闭前回调
可以再内部用done()关闭弹窗
什么都不调用就会阻止对话框关闭

    扩展知识点：.sync是Vue2.3版本新增
    官方文档https://v2.cn.vuejs.org/v2/guide/components-custom-events.html#sync-%E4%BF%AE%E9%A5%B0%E7%AC%A6
    //.sync类似v-model是如何给子组件实现双向数据绑定(父Vue变量要给子组件，子组件传出的值也要自动绑定到父Vue变量
    //)
    //v-model本质:要给所在标签绑定：value="Vue变量" @input="val=>Vue变量=val"
    <标签 v-model="Vue变量"><标签>
运行如下
<标签：value="Vue变量" @input="val=>Vue变量=val”><标签>
Vue2里面一个标签上v-model只能使用一次，vue3里可以使用多次

// .sync本质：给所在标签绑定：props属性名="vue变量" @update:props属性名="val =>Vue变量=val"
//<标签 ：visible.sync="Vue变量" @update:visible="val=>vue变量名=val"></标签>
//子组件内子传父的时候 this.$emit('update:visible')
vue2里它可以用多次，vue3把他移除了
//运行时如下
//
     -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @close="dialogCloseFn">
      <!-- 添加的表单 -->
     <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
  <el-form-item label="分类名称" prop="cate_name">
    <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
  </el-form-item>
  <el-form-item label="分类别名" prop="cate_alias">
    <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
  </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, saveArtCateAPI } from '@/api'
// import { Input } from 'element-ui'

export default {
  name: 'ArtCate',
  data () {
    return {
      cateList: [], // 文章分类数组
      dialogVisible: false, // 增加文章分类对话框--出现（true）隐藏（false）
      addForm: { // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: { // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getArtCateFn()
  },
  methods: {
    // 获取-文章分类列表
    async getArtCateFn () {
      const res = await getArtCateListAPI()
      console.log(res)
      this.cateList = res.data.data
    },
    // 添加分类按钮点击事件=》为了对话框出现
    addCateShowDialogBtnFn () {
      this.dialogVisible = true
    },
    // 对话框确定按钮=》点击事件=》让对话框消失/调用保存文章分类接口
    confirmFn () {
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          // 通过校验
          const { data: res } = await saveArtCateAPI(this.addForm)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.getArtCateFn()
          // 再重新请求一次文章列表，拿到最新数据，让表格更新
          // 生命周期的方法比如created,不会挂载到this身上，无法this.create
          this.getArtCateFn()
        } else {
          return false
        }
      })
      this.dialogVisible = false
    },
    // 对话框取消按钮=》点击事件dialogCloseFn
    cancelFn () {
      this.dialogVisible = false
    },
    // 对话框-关闭时的回调
    dialogCloseFn () {
      this.$refs.addRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
