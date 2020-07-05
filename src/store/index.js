import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有的任务列表
    list: [],
    // 文本框内容
    inputValue: '',
    nextId: 5,
    viewKey: 'all'
  },
  mutations: {
    initList(state, list) {
      state.list = list
    },
    // 为 store 中的inputValue赋值
    setInputValue(state, val) {
      state.inputValue = val
    },
    // 向列表中添加新的项
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue,
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 根据id移除 list 中的 item
    removeItem(state, id) {
      const i = state.list.findIndex(x => x.id === id)
      if (i !== -1) {
        state.list.splice(i, 1)
      }
    },
    // 根据id改变list状态
    changeStatus(state, param) {
      // 根据id找到对应的索引
      const i = state.list.findIndex(x => x.id === param.id)
      // 根据索引改变状态
      if (i !== -1) {
        state.list[i].done = param.status
      }
    },
    // 筛选出未完成的任务，重新赋给list
    cleanDone(state) {
      state.list = state.list.filter(x => x.done === false)
    },
    // 判断列表显示的关键字
    changeViewKey(state, key) {
      state.viewKey = key
    }
  },
  actions: {
    getList(context) {
      axios.get('./list.json').then(({
        data
      }) => {
        console.log(data)
        context.commit('initList', data)
      })
    }
  },
  // 如果store过大，可分块，moduleA,moduleB...
  // modules: {}
  // 对store 的数据进行处理，只读,获得想要的数据
  getters: {
    // 统计未完成的任务条数
    unDoneLength(state) {
      // 过滤，得到数组长度
      return state.list.filter(x => x.done === false).length
    },
    // 根据viewKey进行筛选
    infoList(state) {
      if (state.viewKey === 'all') {
        return state.list
      }
      if (state.viewKey === 'undone') {
        return state.list.filter(x => !x.done)
      }
      if (state.viewKey === 'done') {
        return state.list.filter(x => x.done)
      }
    }
  }
})
