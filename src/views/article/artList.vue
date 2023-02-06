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
                :value="obj.id"
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
            <el-button type="primary" size="small" @click="choseFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetFn">重置</el-button>
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
<el-table :data="artList" style="width: 100%;" border stripe>
  <el-table-column label="文章标题" prop="title">
      <template v-slot="scope">
<el-link type="primary" @click="showDetailFn(scope.row.id)">{{scope.row.title}}</el-link>
  </template>
  </el-table-column>
  <el-table-column label="分类" prop="cate_name"></el-table-column>
  <el-table-column label="发表时间" prop="pub_date">
     <template v-slot="scope">
   <span>{{ $formatDate(scope.row.pub_date) }}</span>
  </template>
  </el-table-column>
  <el-table-column label="状态" prop="state"></el-table-column>
  <el-table-column label="操作"></el-table-column>
</el-table>
      <!-- 分页区域 -->
<el-pagination
  @size-change="handleSizeChangeFn"
  @current-change="handleCurrentChangeFn"
  :current-page.sync="q.pagenum"
  :page-sizes="[2, 3, 5, 10]"
  :page-size.sync="q.pagesize"
  layout="total, sizes, prev, pager, next, jumper"
  :total="total"
>
</el-pagination>
    </el-card>

    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @close="dialogCloseFn"
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
              :value="obj.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor v-model="pubForm.content" @blur="contentChangeFn"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
  <!-- 用来显示封面的图片 -->
  <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
  <br />
  <!-- 文件选择框，默认被隐藏 -->
  <input type="file" style="display: none;" accept="image/*" ref="iptFileRef"
  @change="changeCoverFn" />
  <!-- 选择封面的按钮 -->
  <el-button type="text" @click="selCoverFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
    <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
    <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
</el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// webpack会把图片变为一个base64字符串/在打包后的图片临时地址
import { getArtCateListAPI, uploadArticleAPI, getArtListAPI, getArtDetailAPI } from '@/api'
// 标签和样式中，引入图片文件直接写"静态路径"（把路径放到js的vue变量里再赋予是不行的）
// 原因：webpack分析标签的时候，如果src的值是一个相对路径，他会去帮我们找到那个路径的文件地址
// 并一起打包，打包的时候会分析文件的大小，小图转成base64字符串再赋予给src如果是大图拷贝图片换个路径给img的src显示(运行时)

// vue变量中路径，赋予给标签，都会当成普通的字符串使用
// 我们写的路径是在vscode看着文件夹写的（以前好使对对原因：你用live serve/磁盘双击打开，他都能通过你的相对路径）
// 在指定文件夹下，都能找到图片文件真身
// 现在：写的模板代码，是要被webpack 翻译处理转换，你vscode里的代码，转换后打包到内存中/dist下，相对路径
// 就会变化,运行时,你写的固定路径字符串就找不到那个文件的真身了

// 注意:只有相对路径本地图片需要注意,如果你是个http://外链标签图片,可以直接随便用
// 直接标签里写也行,或者在js用变量保存后赋予给标签 都行,因为运行时,浏览器发现src地址是外链就不就不找相对路径文件夹了

import imgObj from '../../assets/images/cover.jpg'
export default {
  name: 'ArtList',
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1, // 默认拿第一页数据
        pagesize: 2, // 默认当前页需要几条数据(传递给后台,后台就返回几个数据)
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false, // 控制发布文章对话框出现/隐藏（true/false）
      pubForm: {
        // 发布文章-表单的数据对象
        title: '', // 文章标题
        cate_id: '', // 文章分类id
        content: '', // 文章内容
        cover_img: '', // 封面图片（保存的是个文件）
        state: '' // 发布状态 值为：已发布，草稿
      },
      pubFormRules: { // 发布文章-表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],
        content: [{
          // 为何这个输入内容，校验还不自己去掉
          // 原因：
          // content对应quill-editor富文本编辑器，他不是el提供表单标签
          // el-input等输入框的在blur事件时进行校验
          // 下拉菜单，单选框，复选框是在change事件事时进行校验
          // 解决：
          // 自己来给quill-editor绑定change事件(在文档里查到的他支持的change事件内容改变的事件)
          // 在事件处理函数中内用el-form组件对象内，调用某个校验规则再重新执行(validateField)

          required: true, message: '请输入文字内容', trigger: 'change'
        }],
        cover_img: [{ required: true, message: '请选择封面', trigger: 'blur' }]
      },
      cateList: [], // 保存文章分类列表
      artList: [], // 保存文章列表
      total: 0 // 保存现有文章总数
    }
  },
  created () {
    // 请求分类数据
    this.getCateListFn()
    // 请求文章列表
    this.getArticleListFn()
  },
  methods: {
    // 获取-所有分类
    async  getCateListFn () {
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
    },
    // 获取-所以的文章列表
    async getArticleListFn () {
      const { data: res } = await getArtListAPI(this.q)
      this.artList = res.data // 保存当前获取的文章列表(注意有分页:不是所有数据)
      this.total = res.total // 保存总数
    },
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

    // 选择封面点击事件=》让文件选择窗口出现
    selCoverFn () {
      this.$refs.iptFileRef.click() // 用JS来模拟一次点击事件动作
    },
    // 用户选择了封面文件
    changeCoverFn (e) {
      // e.target 拿到触发事件的那个标签(input标签对象本身)
    // e.target.files 拿到选择的文件数组
      const files = e.target.files
      if (files.length === 0) {
      // 用户没有选择图片，那要把cover_img属性置空
        this.pubForm.cover_img = null
        // img要显示回默认的cover.png
        this.$refs.imgRef.setAttribute('src', imgObj)
      } else {
      // 用户选择了图片，把文件直接保存到表单对象的属性里
        this.pubForm.cover_img = files[0]
        // 把图片文件，要显示到img标签里
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }

      // 让表单单独校验封面的规则
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 表单里(点击发布/存为草稿)按钮点击事件=》准备调用后端接口
    pubArticleFn (str) {
      // str的值 "已发布"，或者"草稿" （后端要求的参数值）
      this.pubForm.state = str // 保存到统一表单对象上

      // 兜底校验
      this.$refs.pubFormRef.validate(async valid => {
        if (valid) {
          // 都通过
          console.log(this.pubForm)
          const fd = new FormData() // 准备一个表单数据对象的容器 FormData类是HTML5新出的专门为了装文件内容和
          // 其他参数的容器
          // fd.append('参数名'，值)
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)

          const { data: res } = await uploadArticleAPI(fd)
          if (res.code !== 0) return this.$message.error('发布文章失败！')
          this.$message.success('发布文章成功！')

          // 关闭对话框
          this.pubDialogVisible = false
          // 刷新文章列表=>再次请求文章列表数据
          this.getArticleListFn()
        } else {
          return false // 阻止默认行为(因为按钮有默认提交行为)
        }
      })
    },
    // 富文本编辑器内容改变触发此事件方法
    contentChangeFn () {
      // 目标：如何让el-form校验，只校验content这个规则？
      this.$refs.pubFormRef.validateField('content')
    },
    // 新增文章-》对话框关闭时=》清楚表单
    dialogCloseFn () {
      this.$refs.pubFormRef.resetFields()
      // 我们需要手动给封面标签img重新设置一个值，因为他没有收到v-model影响
      this.$refs.imgRef.setAttribute('src', imgObj)
    },
    // 核心思想:根据选择的页面/条数,影响q对象对应属性的值,再重新发一次请求让后台重新返回数据
    // 分页=>每页条数改变触发
    handleSizeChangeFn (sizes) {
      console.log('每页显示的条数', sizes)
      // sizes:当前需要每页显示的条数
      // 核心思想:在Pagination的标签上宜家加了.sync,子组件内会双向绑定到右侧变量上(q对象里的pagesize已经改变了
      // 如果不放心,再写一遍)
      this.q.pagesize = sizes

      // 问题:先点击最后一个页码,切换每页显示条数2=>3,总数不够,分页只能分到2
      // 每条条数改变了,页面从3到2改变了,两个事件都会触发
      // 偶发性的bug:有的时候自动回到第二页有数据有的时候没有
      // 知识点:2个网络请求一起发,谁先回来不一定,所有可能第二页3条数据回来有值铺设,紧接着第三页的第三天数据回来了
      // 是个空数组所有页面就是空的
      // 解决:当切换每页显示的条数,我们就把当前页面设置为1,而且标签里要设置当前页码为1
      this.q.pagenum = 1

      this.getArticleListFn()
    },
    // 当前页面改变时触发
    handleCurrentChangeFn (nowPage) {
      // nowPage:当前要看的第几页,页数
      this.q.pagenum = nowPage
      this.getArticleListFn()
    },
    // 筛选按钮=>点击事件
    choseFn () {
      // 目的:当有了筛选的条件,我想让页码回归1,每条的条数回归2
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.getArticleListFn()
    },
    // 重置按钮=>点击事件
    resetFn () {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.q.cate_id = ''
      this.q.state = '' // 对象改变,v-model关联的表单标签也会变为空
      this.getArticleListFn()
    },
    // 文章标配点击事件=>为了查看详情
    async showDetailFn (artId) {
      // artId:文章id值
      const { data: res } = await getArtDetailAPI(artId)
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
// scoped 属性的作用：让style里的选择器，只能选择当前组件的标签（为了保证样式的独立性，不影响别的组件）
//scoped原理：(多加了一个data-v的属性选择器)
// webpack打包的时候，会给组件标签上添加相同data-v-hash值，然后也会给所有选择器后面
//加上一个[data-v-hash]值的属性选择器
// <标签 data-v-390246 class="my_a"></标签>
// 选择器会变成.my_a[data-v-390246]

// 重要注意事项：scoped只会给当前组件所有原生标签添加data-v-hash值属性，还会给组件内根标签添加
// data-v-hash值属性，组件内的标签不会添加

.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
// ::v-deep .ql-editor {
//   min-height: 300px;
// }  //最小高度:标签本身的高度靠内容撑开,但是无内容就没有300高度,标签会设置最小高度为300px
// 如果内容大于300px，标签高度也会随着撑开（比300px大）

// 直接给height：那么无论容器的内容有多少，超出300高度的内容会溢出到外面而不是撑开此容器
/* .ql-editor{
  min-width: 300px;
} */ //上面这样写：选不中富文本组件内的标签的
//原因：你写在这里会被在后面加上[data-v-hash]属性选择器，而他对应的那个标签组件内标签，
//  scoped又不会给他加入data-v-hash值属性，所以属性选择器选不中
// 解决：
// 原来：.ql-editor[data-v-hash值] 你标签上既有class也要有属性才能选中设置样式
// 解决：Vue提供了一个::v-deep样式语法，设置后，可以把属性选择器被自动添加到左侧
// 现在[data-v-hash值] .ql-editor
 ::v-deep .ql-editor {
  min-height: 300px;
 }

// 总结：scoped不会给组件内的标签添加data-v属性，所以你要用 ::v-deep 穿透选择组件内标签设置样式
</style>
