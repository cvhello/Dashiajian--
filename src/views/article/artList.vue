<template>
  <div>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <el-option
                v-for="obj in cateList"
                :key="obj.id"
                :label="obj.cate_name"
                :value="obj.cate_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="showPubDialogFn"
          >发表文章</el-button
        >
      </div>

      <!-- 文章表格区域 -->

      <!-- 分页区域 -->
    </el-card>

    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
    >
      <!-- 发布文章的对话框 -->
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="pubForm.cate_id"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <!-- 因为整个表单要发给后台,先去看眼vue代码里绑定的值需要什么,发现接口文档里面是分类的id   -->
            <el-option
              v-for="obj in cateList"
              :key="obj.id"
              :label="obj.cate_name"
              :value="obj.cate_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor v-model="pubForm.content"></quill-editor>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI } from '@/api'
export default {
  name: 'ArtList',
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false, // 控制发布文章对话框出现/隐藏（true/false）
      pubForm: { // 发布文章-表单的数据对象
        title: '', // 文章标题
        cate_id: '', // 文章分类id
        content: '' // 文章内容
      },
      pubFormRules: { // 发布文章-表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'blur' }],
        content: [{
          required: true, message: '请输入文字内容', trigger: 'blur'
        }]
      },
      cateList: [] // 保存文章分类列表
    }
  },
  created () {
    this.getCateListFn()
  },
  methods: {
    // 发表文章的按钮点击事件=》让对话框出现
    showPubDialogFn () {
      this.pubDialogVisible = true
    },
    // 发布文章-对话框-关闭前的回调
    // 注意：自带的三种关闭方式：dialog自带的点右上角的x，和按下esc按键，和点击半透明蒙层才会走这里
    // 以及你自己设置的visible对应的变量为false,都会导致关闭前回调触发
    async handleClose (done) { // done的作用：调用才会放行让对话框关闭
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err) // 捕获确认框Promise 对象里选择取消 时,拒绝状态结果'cancel'字符串
      console.log(confirmResult)
      // $confirm内部虽然是一个确认的提示框，但是他借用了Promise语法来管理，点击确认他的状态为兑现
      // 成功状态返回'confirm'如果用户点击了取消按钮,此Promise对象状态为拒绝状态,返回'cancel'字符串
      // 知识点回顾
      // 1.await只能用在被async修饰的函数内
      // async修饰：就是在当前函数名左边加async关键字，如果没有函数名，在形参的左边加async
      // 原因：async修饰的函数就是异步函数，如果此函数调用，总数返回一个Promise对象
      // 而且本次函数调用是因为是异步函数，所以外面的同步代码继续执行，而await暂停代码只能暂停async函数内的，
      // 等待await后面异步结果
      // 2.await只能拿到成功的结果,如果失败室内会向浏览器控制台抛出错误并不会让await往下走代码
      // 3.await后面的Promise对象的拒绝状态(错误)如何捕获呢?
      // 方法1:try{} catch(err){}
      // 方法2:用Promise的链式调用,而且在catch里return的非Promise拒绝状态的对象,都会当作
      // 成功的结果返回给原地新的Promise对象结果

      // 取消了关闭-阻止住, 什么都不干 对话框不能关闭 提取return不让done执行
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 获取-所有分类
    async  getCateListFn () {
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}

// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}
</style>
