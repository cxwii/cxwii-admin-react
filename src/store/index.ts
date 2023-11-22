import { configureStore } from '@reduxjs/toolkit'
import userReducer from './module/user'

const store = configureStore({
  reducer: {
    // 多个也是放到这里,组合起来
    user: userReducer
  }
})

export default store