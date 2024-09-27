import React, {useState} from "react"

const TestArray = () => {
    const [data, setData] = useState([])

    const testData = ["Janne","Simo","Jouni","Reetta"]
    
    const handler = () => {
        setData(testData)
    }
    

    console.log(data)

    return ( 
        <>
        <h2>Hello</h2>
        <button onClick = {handler}></button>
        <li>{data.map(m => m)}</li>
        </>
     )
}
 
export default TestArray;