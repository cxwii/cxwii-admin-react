import { createContext, useContext, useEffect, useRef, useState, useReducer, useMemo, memo, useCallback } from 'react'
import { inscrement, decrement, setUsername, getList } from './store/module/user'
import { useSelector, useDispatch } from "react-redux"
import { Link, useMatch, useNavigate } from "react-router-dom"
import { Button } from 'antd'

// useSelector类型的问题解决方案
import store from './store'
type GetstateFunType = typeof store.getState
type IRootState = ReturnType<GetstateFunType>
// 你还可以在一个hook里面这样定义一个自己的useSelector来用,这么写笔记而已就不搞了
// TypedUseSelectorHook在react-redux里面
// export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector

// 异步操作action类型的问题解决方案
// 也是应该和上面那里一样定义在同一个hook里,然后使用,同样也麻烦写了
type AppDispatch = typeof store.dispatch
const useAppDispatch: () => AppDispatch = useDispatch

// 跨层传递
//先用createContext创建上下文对象
// 然后在顶层组件通过Provider组件(注意是一个组件,内置的一个组件)提供数据
// 最后在其他底层组件可以通过useContext来使用数据
const MsgContext = createContext('默认的值') // 默认值在Provider没有传数据时起效


const Son = (props: any) => {
  // props什么值都能传,函数,dom(jsx)都能

  // 子传父其实就是父组件传个回调函数过来,然后使用传参就可以了
  // 这样传函数一般用on,一个约定,看情况而定

  // 兄弟组件则可以通过 a => 父 => b的方式来传


  // ContextValue的值
  const ContextValueSon = useContext(MsgContext)
  console.log('ContextValueSon :>> ', ContextValueSon)



  console.log('插槽 :>> ', props.children)
  return (
    <>
      <div>子组件接受的值--{props.sondata}</div>
    </>
  )
}

function App() {
  
  // useState属于钩子函数只能在组件函数主体中调用
  // setCount是替换一个值,因为react的值都是只读的
  // 所以setCount里面是传一个值去替换
  const [ count, setCount ]  = useState<number>(0)
  // 对象的写法
  const [ form, setform ]  = useState({
    name: 'admin',
    password: 123456
  })

  const test = () => {
    setform({
      ...form,
      name: 'cxwii'
    })
  }

  // 受控表单的绑定
  const [inputValue, setInputValue] = useState<any>('')


  // 获取dom
  const divDOM = useRef(null)

  const test2 = () => {
    console.log('divDOM :>> ', divDOM)
  }

  // 传递给子组件的值
  const sondata = '父子组件传值'
  
  // Context传递的值
  const ContextValue = 'ContextValue'


  // 数据的请求时机
  // useEffect会在组件渲染完毕时调用箭头函数内的方法
  // 第二个参数用于影响第一个参数的执行时机
  // 1当是个空数组的时候,函数只会在组件渲染完毕执行一次
  // 2当没有这个参数时,函数只会在组件渲染完毕和组件更新时执行
  // 3当这个参数为特定的依赖项的时候,数组里的依赖项变化时函数就执行
  //  有点像vue里面的methods加上watch,监听数据变化重新渲染列表
  useEffect(() => {
    console.log('useEffect执行 :>> ')
    // 请求的方式
    // conts getList = () => {}
    // getList() // 定义完就直接在里面调用就可以了

    // 最后面返回一个函数可以作为清除函数,它的作用是在所在组件被卸载时调用
    // 这么说来useEffect应该是vue的methods加上watch再加上beforeUnmount才对
    return () => {
      // 卸载操作
      // 执行时机是所在组件被卸载时,但当
      // useEffect 的第 2 个参数不写
      // 清理函数会在下一次副作用回调函数调用时以及组件卸载时执行
      // 用于清除上一次或卸载前的副作用
    }
  },[])


  // hook和vue基本一模一样就不写了

  // 使用store
  const { username, mycount } = useSelector((state: IRootState) => state.user)
  // 修改store
  const dispatch = useAppDispatch()


  // 路由
  const navigate  = useNavigate()


  // useReducer和useState差不多都是用于数据处理的,不同的是useState是处理简单的数据
  // useReducer是用一个函数来根据不同状态返回不同的数据
  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case "INC":
        return state + 1
      case "DEC":
        return state - 1
      case "SET":
        return action.payload
      default:
        return state
    }
  }

  const [redState, redDispatch] = useReducer(reducer, 0)


  // useMemo
  // 缓存值
  // 在组件每次重新渲染的时候缓存计算的结果,有点类似于vue的计算属性
  // 好处是用它计算的结果只会在依赖项变化时重新计算,非依赖项不会引发
  // useMemo(() => {
  //   // 可以直接在里面调用一个函数,函数传值就是依赖项这样
  //   // foo('下面的哪里的依赖项')
  //   // 这样只有依赖项发生变化foo()才会执行
  //   return '返回结果'
  // },['依赖项'])


  // react默认中父组件发生状态变化的时候,子组件也会重新渲染
  // 所以可以通过memo来依赖缓存,往里面放一个子组件或者jsx
  // 他会返回一个新的组件提供使用,这个组件只会在props发生变化才会重新渲染
  // <sonMemo></sonMemo>
  // const sonMemo =  memo(() => {
  //     return <div>son</div>
  //   }
  // )
  // 它的机制其实就是用object.is()来做对比,对比通过就相当于props没有变化
  // 但object在对比引用数据类型时是false比如Object.is([], [])
  // 这时候反而会会重新渲染了,这是一个机制不是bug
  // 所以这时候就可以用到上面的useMemo来缓存依赖了
  // 只要如下这样就可以了
  // const list = useMemo(() => {
  //   return [1, 2, 3]
  // }, [])
  // 这个list在作为props的时候是不会生成新的数组去比较的
  // 所以Object.is([], [])就变成了Object.is(list, list)
  // 这样就是true了,就不会有问题了

  
  // useCallback
  // 和useMemo差不多,其实就上上面说的情况
  // 当props为函数的时候就可以使用useCallback来保持稳定
  // const change = useCallback(() => {}, [])
  // useMemo返回的是值,而useCallback是回调函数,但其实用useMemo直接返回个函数也可以
  // 但没这么优雅,就和vue的ref和refactive一样的关系


  return (
    <>
      <MsgContext.Provider value={ContextValue}>
        <div>cxwii-admin-react</div>
        {count}
        {form.name}
        <button onClick={test}>test</button>
        <button onClick={() => setCount(count + 1)}>count++</button>
        <br/>
        {inputValue}
        <input value={inputValue} onChange={(e) => {setInputValue(e.target.value)}}></input>
        <br/>
        <div ref={divDOM}>123</div>
        <button onClick={test2}>测试</button>
        <div>---------------------------------------</div>
        <Son sondata={sondata}>
          <div>children-插槽</div>
        </Son>
        <div>---------------------------------------</div>
        <div>store数据:{username}</div>
        <button onClick={() => dispatch(setUsername('cxwii'))}>修改</button>
        <button onClick={() => dispatch(getList())}>异步修改</button>
        <div>store数据:{mycount}</div>
        <button onClick={() => dispatch(inscrement())}>++</button>
        <button onClick={() => dispatch(decrement())}>--</button>
        <div>---------------------------------------</div>
        <div>路由</div>
        <Link to='/test2'>声明式跳转</Link>
        <button onClick={() => {
          navigate('/test2')
        }}>编程式跳转</button>
        <div>---------------------------------------</div>
        <div>antd</div>
        <Button type="primary">Button</Button>
        <div>---------------------------------------</div>
        <div>useReducer</div>
        <div>useReducer值:{redState}</div>
        <button onClick={() => redDispatch({type: 'INC'})}>++</button>
        <button onClick={() => redDispatch({type: 'DEC'})}>--</button>
        <button onClick={() => redDispatch({type: 'SET', payload: '114154'})}>set</button>
      </MsgContext.Provider>
    </>
  )
}

export default App
