import React, { createContext, useState } from "react";

interface STATE {
    loggedIn: boolean,
    host: boolean
}

interface CONTEXT {
    state: STATE,
    meetHandler: (host: boolean) => void
}

type Props = {
    children: React.ReactNode
}

const INIT_STATE: STATE = {
    loggedIn: false,
    host: false
}

const CONTEXT_DEFN: CONTEXT = {
    state: INIT_STATE,
    meetHandler: () => {}
}

export const Context = createContext(CONTEXT_DEFN)

const ContextProvider: React.FC<Props> = ({ children }) => {
    const [state, setState] = useState<STATE>(INIT_STATE)

    const meetHandler = (host: boolean) => {
        setState({
            ...state,
            host
        })
    }

    return(
        <Context.Provider value={{
            state,
            meetHandler
        }}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider;