import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// 在根目录中注册store
import store from './store'
import { Provider } from 'react-redux'
// 使用Router
import { createBrowserRouter, RouterProvider, Outlet, Link } from "react-router-dom"

// 编写Router
// 正常分模块来写才对,我这里写笔记而已就不分了
// createBrowserRouter是history
// 换成createHashRouter就是hsah
const router = createBrowserRouter([
  {
    index: true,
    element: <App />
  },
  // 懒加载的写法,主要靠lazy,还有按需加载等等都差不多(注意要Component,或者头部引入)
  {
    path: '/test1',
    Component: lazy(() => import('./App.tsx'))
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>,
)
