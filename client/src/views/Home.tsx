import React, { useRef } from "react";
import { useHistory } from "react-router-dom";

const Home: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const history = useHistory()

    const startMeet = async() => {
        // history.replace(`/room`)
        window.open(`/room?host=${true}`)
        // try{
        //     const response = await axios.get("room")
        //     console.log(response)
        //     window.open(`/room?room=${response.data}`)
        // }
        // catch(err){
        //     console.log(err)
        // }
    }

    const joinRoom = () => {
        if(inputRef.current?.value !== ""){
            window.open(`/room?room=${inputRef.current?.value}`)
        }
    }

    return(
        <>
            <button onClick={startMeet}>HOST MEETING</button>
            <p>--OR--</p>
            <input ref={inputRef} />
            <button onClick={joinRoom}>JOIN</button>
        </>
    )
}

export default Home