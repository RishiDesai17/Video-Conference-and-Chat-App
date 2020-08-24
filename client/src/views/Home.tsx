import React, { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Context } from '../context/Context';

const Home: React.FC = () => {
    const inputRef = useRef<string>("")
    const history = useHistory()
    const context = useContext(Context)

    const meet = (host: boolean) => {
        context.meetHandler(host)
        history.push(`/room?room=${inputRef.current}`)
    }

    return(
        <>
            <button onClick={() => meet(true)}>HOST MEETING</button>
            <p>--OR--</p>
            <input onChange={e => {
                inputRef.current = e.target.value
            }} />
            <button onClick={() => meet(false)}>JOIN</button>
        </>
    )
}

export default Home