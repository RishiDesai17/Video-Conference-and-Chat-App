import React, { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Context } from '../context/Context';

const Home: React.FC = () => {
    const inputRef = useRef<string>("")
    const history = useHistory()
    const context = useContext(Context)
    console.log(context)

    const joinRoom = () => {
        history.push(`/room/${inputRef.current}`)
    }

    return(
        <>
            <button>HOST MEETING</button>
            <p>--OR--</p>
            <input onChange={e => {
                inputRef.current = e.target.value
            }} />
            <button onClick={joinRoom}>JOIN</button>
        </>
    )
}

export default Home