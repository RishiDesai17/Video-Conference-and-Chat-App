import React, { createContext, useState } from "react";
import axios from 'axios';

interface STATE {
    loading: boolean,
    loggedIn: boolean,
    host: boolean,
    profile: Profile
}

interface CONTEXT {
    state: STATE,
    init: (getprofile: boolean) => void,
    login: (email: string, password: string) => Promise<boolean>,
    meetHandler: (host: boolean) => void
}

interface Profile {
    name: string,
    email: string
}

type Props = {
    children: React.ReactNode
}

const INIT_STATE: STATE = {
    loading: true,
    loggedIn: false,
    host: false,
    profile: {
        name: "",
        email: ""
    }
}

const CONTEXT_DEFN: CONTEXT = {
    state: INIT_STATE,
    init: () => {},
    login: () => Promise.resolve(true),
    meetHandler: () => {}
}

export const Context = createContext(CONTEXT_DEFN)

const ContextProvider: React.FC<Props> = ({ children }) => {
    const [state, setState] = useState<STATE>(INIT_STATE)

    const init = async(getprofile: boolean) => {
        try {
            const response = await axios.post('api/users/refresh',
                JSON.stringify({
                    getprofile
                }),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            console.log(response.data)
            setState({
                ...state,
                loading: false,
                loggedIn: true,
                profile: response.data.profile
            })
        }
        catch(err) {
            console.log(err)
            setState({
                ...state,
                loading: false,
            })
        }
    }

    const login = async(email: string, password: string) => {
        try{
            const response = await axios.post('api/users/login', 
                JSON.stringify({
                    email: email,
                    password: password
                }),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            console.log(response.data)
            setState({
                ...state,
                loggedIn: true,
                profile: response.data.profile
            })
            return true
        }
        catch(err){
            console.log(err)
            // alert
            return false
        }
    }

    const meetHandler = (host: boolean) => {
        setState({
            ...state,
            host
        })
    }

    return(
        <Context.Provider value={{
            state,
            init,
            login,
            meetHandler
        }}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider;