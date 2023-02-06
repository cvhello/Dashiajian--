//  封装的是具体的接口请求方法
//  注意： 每个方法只负责请求一个url地址
import request from '@/utils/request' // 引入自定义函数

// registerAPI(this.form)
// registerAPI({
// username:'',
// password: '',
// repassword: ''
// })
// 形参obj的值
// 左侧想要解构赋值（语法？）
// obj={username:'',password:'值',repassword:''}
// {username:'username变量名',password: '变量名',repassword: '变量名' }={ username:'',password: '',repassword: '' }
// 函数形参的obj就改成对象结解构接受传入的数据对象
// {username:username,password: password,repassword:repassword}
// key是传入的对象key匹配，value是变量名，用于接受外面传入的值
// es6规定，key和value变量同名的时候，可以简写（key即是key 也是value的变量名）

/**
 * 注册接口
 * @param {*} param0 {username:用户名，password:密码，repassword}
 * @returns Promise对象
 */
// 导出接口方法，为了在逻辑页面引入后调用
export const registerAPI = ({ username, password, repassword }) => {
  // 原地是一个Promise对象 （内部包含原生ajax请求）
  // return 这个PRomise对象到逻辑页面，去那边对Promise对象提取结果
  return request({
    url: '/api/reg',
    method: 'POST',
    // axios 传参params，data
    // arams的对象参数名和值，axios源码会把参数和值，拼接在url?后面给后台
    // data的对象参数名和值，axios源码会把参数和值，拼接在请求体里（body参数）
    data: {
      username,
      password,
      repassword
    }
  })
}

/**
 * 登录接口
 * @param {*} param0 { username: '用户名', password: '密码'}
 * @returns  Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

/**
 * 获取用户信息
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
    // method不写默认就是'get'方式请求
  })
}

/**
 * 获取-侧边栏数据
 * @returns Promise对象
 */
export const getMenusListAPI = () => {
  return request({
    url: '/my/menus'
  })
}

/**
 * 更新基本资料
 * @param {*} param0
 * @returns
 */
export const updatedUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}

/**
 * 更新用户头像
 * @param {*} avatar  头像图片base64字符串
 * @returns  Promise对象
 */
export const updatedUserAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar // 头像base64字符串
    }
  })
}

/**
 * 更新用户密码
 * @param {*} param0 { old_pwd:旧密码 new_pwd：新密码, re_pwd：确认新密码 }
 * @returns  Promise对象
 */
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}

/**
 * 获取文章分类
 * @returns Promise对象
 */
export const getArtCateListAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 增加-文章分类
 * @param {*} param0 { cate_name:文章分类名，cate_alias:分组分类别名}
 * @returns Promise对象
 */
export const saveArtCateAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 * 更新文章的分类
 * @param {*} param0  {id：文章分类id  cate_name:文章分类名，cate_alias:分组分类别名}
 * @returns Promise对象
 */
export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

/**
 * 删除文章分类
 * @param {*} id 文章分类id
 * @returns Promise对象
 */
export const delArtCateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'delete',
    params: {
      id
    }
  })
}

/**
 * 发布文章
 * @param {*} fd  FormData 表单数据对象
 * @returns Promise对象
 */
export const uploadArticleAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: fd
    // {}如果是一个普通对象，axios会把他转成JSON字符串在请求体里交给后台
    // 这个接口文档要求请求体里是一个FormData类型(表单数据对象)携带文件给后台

  })
}

/**
 * 获取-文章列表
 * @param {*} param0 {pagenum:当前页码,pagesize:当前页需要的数据条数
 * cate_id:当前文章分类id,state:文章状态}
 * @returns Promise对象
 */
export const getArtListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

/**
 * 获取文章详情
 * @param {*} id  文章id
 * @returns Promise对象
 */
export const getArtDetailAPI = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}
