import React, { useRef } from "react";

const Home: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null)

    const startMeet = async() => {
        window.open(`/room?host=${true}`)
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