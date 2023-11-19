import { useRef, useState } from 'react'

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
  
  return (
    <>
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
    </>
  )
}

export default App
