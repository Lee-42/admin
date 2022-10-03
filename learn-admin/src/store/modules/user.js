import { login, getUserInfo } from '@/api/sys'
import md5 from 'md5'
import { getItem, removeAllItem, setItem } from '../../utils/storage'
import { TOKEN } from '@/constant/index'
import router from '@/router'
import { setTimeStamp } from '@/utils/auth'

export default {
  namespaced: true, // 表示单独的模块, 不会被合并到主模块里去
  state: () => ({
    token: getItem(TOKEN),
    userInfo: {}
  }),
  mutations: {
    setToken(state, token) {
      state.token = token
      setItem(TOKEN, token)
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    /**
     * 登录请求动作
     * @param {Object} context
     * @param {OBject} userInfo
     * @returns
     */
    login(context, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({
          username,
          password: md5(password)
        })
          .then((data) => {
            this.commit('user/setToken', data.token)
            // 跳转
            router.push('/')
            // 保存登录时间
            setTimeStamp()
            resolve()
          })
          .catch(reject)
      })
    },

    /**
     * 获取用户信息
     * @param {Object} context
     * @returns
     */
    async getUserInfo(context) {
      const res = await getUserInfo()
      this.commit('user/setUserInfo', res)
      return res
    },

    /**
     * 退出登录
     */
    logout() {
      this.commit('user/setToken', '')
      this.commit('user/setUserInfo', {})
      removeAllItem()
      // TODO: 清理权限相关配置
      router.push('/login')
    }
  }
}
