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
          <!-- scope对象：{row:行对象} -->
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="updateCateBtnFn(scope.row)">修改</el-button>
          <el-button type="danger" size="mini">删除</el-button>
          </template>
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
// 经验：如果用同一个按钮，想要做状态区分
// 1.定义一个标记变量isEdit(true编辑，false为新增)，还要定义本次要编辑的数据唯一id值，editId
// 2.在点击修改的时候，isEdit改为true,editId保存要修改的数据id
// 3.在点击新增按钮的时候，isEdit改为false editId置空
// 4.在点击保存按钮时(确定按钮时，就可以用isEdit变量做区分了、)
import { getArtCateListAPI, saveArtCateAPI, updateArtCateAPI } from '@/api'

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
      },
      isEdit: false, // 默认新增 true为编辑状态，false为新增状态
      editId: ''// 保存正在要编辑的数据id值
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
      this.isEdit = false // 变回新增状态标记
      this.editId = ''
      this.dialogVisible = true
    },
    // 对话框确定按钮=》点击事件=》让对话框消失/调用保存文章分类接口
    confirmFn () {
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          // 通过校验
          if (this.isEdit) {
            // 要修改
            // this.addForm.id = this.editId // 把要编辑的文章分类id添加到对象身上
            //  updateArtCateAPI(this.addForm)
            const { data: res } = await updateArtCateAPI({ id: this.editId, ...this.addForm })
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          } else {
            // 要新增
            const { data: res } = await saveArtCateAPI(this.addForm)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          }
          // 再重新请求一次文章列表，拿到最新数据，让表格更新
          // 生命周期的方法比如created,不会挂载到this身上，无法this.create
          this.getArtCateFn()
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    // 对话框取消按钮=》点击事件dialogCloseFn
    cancelFn () {
      this.dialogVisible = false
    },
    // 对话框-关闭时的回调
    dialogCloseFn () {
      this.$refs.addRef.resetFields()
    },
    // 修改分类按钮-》点击事件（先做数据回显）
    updateCateBtnFn (obj) {
      this.isEdit = true
      this.editId = obj.id
      // obj 的值：{id:文章分类id。cate_name: 文章分类名字，cate_alias:文章分类别名}
      console.log(obj)
      this.dialogVisible = true

      // 让el-dialog第一次挂载el-form时，先用addForm空字符串初始值绑定到内部，后续用作resetFields重置
      // 所以让真实Dom先创建并在内部绑定好复制号初始值

      // 接着外面真实Dom更新后绑定好了，咱们再给数据回显
      // 注意：我们给v-model对象赋值只是影响当前显示的值，不会影响到resetFields复制的初始值
      this.$nextTick(() => {
        // 数据回显（回填）
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    }
  }
}

// 小bug：(el-form和el-dialog和数据回显，同时用，有bug)
// 复现：第一次打开网页，先点击修改，再点击新增，发现输入框竟然有值
// 原因 ：点击修改后，关闭对话框的时候，置空失效了
// 具体分析：主人公resetFields
// 线索：Dialog 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。因此，如果需要执行 DOM 操作，
// 或通过 ref 获取相应组件，请在 open 事件回调中进行。第二次只是做css的隐藏和显示
// 线索：Vue数据改变（先执行同步所有）再去更新Dom(异步代码)

// 无问题：第一次打开网页先点击新增按钮=》dialog出现=》el-form组件第一次挂载（关联属性值为空字符串）

// 有问题：第一次打开网页，先点击修改按钮=》虽然dialog变量为true但是同步代码把addForm对象里赋值了（）默认值
// =》dom更新异步=》dialog出现=》el=》form组件第一次挂载（使用addForm内置做回显然）
// 然后第一次el-form内绑定了初始值（有值）=》以后做重置，他就用绑定的带值的做重置

// 解决：让数据回显慢点执行
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
