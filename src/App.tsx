import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { inscrement, decrement, setUsername, getList } from './store/module/user'
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

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
      </MsgContext.Provider>
    </>
  )
}

export default App
