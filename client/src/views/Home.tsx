import React, { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Context } from '../context/Context';
import axios from "axios";

const Home: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const history = useHistory()
    const context = useContext(Context)

    const startMeet = async() => {
        // context.meetHandler(true)
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
        // context.meetHandler(false)
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