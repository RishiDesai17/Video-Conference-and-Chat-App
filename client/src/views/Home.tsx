import React, { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Context } from '../context/Context';

const Home: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const history = useHistory()
    const context = useContext(Context)

    const startMeet = () => {
        context.meetHandler(true)
        history.replace(`/room`)
    }

    const joinRoom = () => {
        context.meetHandler(false)
        if(inputRef.current?.value !== ""){
            history.replace(`/room?room=${inputRef.current?.value}`)
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