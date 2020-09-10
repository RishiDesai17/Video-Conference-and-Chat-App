import React, { useState, useRef, useCallback, useContext, MouseEvent } from "react";
import { useHistory } from "react-router-dom";
import { Button } from '@material-ui/core';
import Register from "./Register";
import useStore from '../zustand/store';
import useWillMount from '../custom hooks/useWillMount';
import "./styles/Login.css";

const Login: React.FC = () => {
    const [showLogin, setShowLogin] = useState<boolean>(true)
    const { login, loggedIn } = useStore(useCallback(state => ({ login: state.login, loggedIn: state.loggedIn }), []))
    const emailRef = useRef<string>("")
    const passwordRef = useRef<string>("")
    const history = useHistory()

    useWillMount(() => {
        if(loggedIn){
            history.replace("/")
        }
    })

    const loginHandler = useCallback((e: MouseEvent) => {
        e.preventDefault()
        if(loginValidation()){
            login(emailRef.current, passwordRef.current)
        }
        else{
            alert("Please fill in both the fields")
        }
    }, [])

    const loginValidation = useCallback(() => {
        return (emailRef.current !== "" && passwordRef.current !== "")
    }, [])

    const switchHandler = useCallback((bool: boolean) => {
        setShowLogin(bool)
    }, [])

    return(
        <div id="login-container">
            {showLogin ? 
                <div id="inner-login-container">
                    <p id="loginTitle">LOGIN</p>
                    <form>
                        <input type="text" className="inputs" placeholder="Email ID" onChange={e => {
                            emailRef.current = e.target.value
                        }} />
                        <input type="password" className="inputs" placeholder="Password" onChange={e => {
                            passwordRef.current = e.target.value
                        }} />
                        <Button variant="contained" color="inherit" id="loginButton" onClick={(e) => loginHandler(e)}>
                            Login
                        </Button>
                        <p id="login-register">Don't have an account? <b id="login-register-link" onClick={() => switchHandler(false)}>Register</b></p>
                    </form>
                </div>
            :
                <Register switchHandler={switchHandler} />
            }
        </div>
    )
}

export default Login