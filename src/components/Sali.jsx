import { useEffect, useState } from "react";

const Sali = () => {

    const[text, setText] = useState("")

    useEffect(() => {
        fetch("/tekstit/Kuntosaliohjelma.txt")
            .then(response => response.text())
            .then((data) => setText(data))
    }, []
    )

    return (
                
        <div className="sali">
            
            <pre>{text}</pre>
        </div>
        

    );
}

export default Sali;