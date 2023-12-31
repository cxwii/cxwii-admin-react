import { createSlice, Dispatch } from '@reduxjs/toolkit'

// redux还有个类似pinia的平替Zusstand,非常简单轻便

const userStore = createSlice({
  name: 'user',
  initialState: {
    username: 'admin',
    mycount: 0
  },
  reducers: {
    inscrement(state) {
      state.mycount++
    },
    decrement(state) {
      state.mycount--
    },
    setUsername(state, action) {
      state.username = action.payload
    }
  }
})

const { inscrement, decrement, setUsername } = userStore.actions
// 异步的请求
// 这里还可以直接加入持久化的东西
const getList = () => {
  return async (dispatch: Dispatch) => {
    const res = await new Promise((resolve) => {
      setTimeout(() => {
        resolve('myList')
      }, 3000)
    })
    dispatch(setUsername(res))
  }
}


const reducer = userStore.reducer

export { inscrement, decrement, setUsername, getList }
export default reducer