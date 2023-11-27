import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
// 在根目录中注册store
import store from './store'
import { Provider } from 'react-redux'
// 使用Router
import { createBrowserRouter, RouterProvider, Outlet, Link } from "react-router-dom"

// import App from './App.tsx'
// 懒加载的写法,lazy,还有按需加载等等都差不多
// 被加载的组件还要加上<Suspense>内置组件
// vue3中的Suspense还属于实验室功能
const App = lazy(() => import('./App.tsx'))

// 编写Router
// 正常分模块来写才对,我这里写笔记而已就不分了
// createBrowserRouter是history
// 换成createHashRouter就是hsah
const router = createBrowserRouter([
  {
    index: true,
    element: <App />
  },
  {
    path: '/test1',
    element: <Suspense fallback={'加载中'}><App /></Suspense>
  },
  {
    path: '/test2',
    element: <>
      <div>test2</div>
      <div>嵌套的路由</div>
      <Link to='/test2'>嵌套1</Link>
      <div>----</div>
      <Link to='/test2/children2'>嵌套2</Link>
      {/* 路由的占位符Outlet */}
      <Outlet></Outlet>
    </>,
    children: [
      {
        // 去掉path,加上index就相当于重定向,这个路由将作为默认的路由
        // 此时只要访问/test2,children1就会自动显示在占位符
        index: true,
        element: <div>children1</div>
      },
      {
        path: 'children2',
        element: <div>children2</div>
      }
    ]
  },
  {
    // 路由通配符
    path: '*',
    element: <div>404</div>
  }
])

// react的路由守卫的方式一般采用高阶组件的写法
// 就是有一个中间组件,大概如下
// const AuthRoute = ({ children }) {
//   const token = getToken()
//   if (token) {
//     return <>{children}</>
//   } else {
//     // replace替换模式
//     return <Navigate to={'/login'} replace></Navigate>
//   }
// }
// 然后在路由里引入使用,如这样
// element: <AuthRoute><foo></foo></AuthRoute>

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>,
)
