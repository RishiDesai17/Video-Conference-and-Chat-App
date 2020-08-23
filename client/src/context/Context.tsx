import React, { createContext, useState } from "react";

interface STATE {
    loggedIn: boolean
}

interface CONTEXT {
    state: STATE
}

type Props = {
    children: React.ReactNode
}

const INIT_STATE: STATE = {
    loggedIn: false
}

const CONTEXT_DEFN: CONTEXT = {
    state: INIT_STATE
}

export const Context = createContext(CONTEXT_DEFN)

const ContextProvider: React.FC<Props> = ({ children }) => {
    const [state, setState] = useState<STATE>(INIT_STATE)

    return(
        <Context.Provider value={{
            state
        }}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider;