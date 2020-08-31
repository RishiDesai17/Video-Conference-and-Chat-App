import React, { useState, useRef, useCallback, MouseEvent } from "react";
import { Button } from '@material-ui/core';
import Register from "./Register";
import "./styles/Login.css";

const Login: React.FC = () => {
    const [showLogin, setShowLogin] = useState<boolean>(true)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const login = useCallback(async(e: MouseEvent) => {
        e.preventDefault()
        if(emailRef.current && passwordRef.current && emailRef.current?.value !== "" && passwordRef.current?.value !== ""){
            const email = emailRef.current?.value
            const password = passwordRef.current?.value

        }
        else{
            alert("Please fill in both the fields")
        }
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
                        <input type="text" className="inputs" placeholder="Email ID" ref={emailRef} />
                        <input type="password" className="inputs" placeholder="Password" />
                        <Button variant="contained" color="inherit" id="loginButton" onClick={(e) => login(e)}>
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