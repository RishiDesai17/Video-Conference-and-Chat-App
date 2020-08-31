import React, { useRef, useCallback, MouseEvent } from "react";
import { Button } from '@material-ui/core';
import './styles/Register.css';

interface Props {
    switchHandler: (bool: boolean) => void
}

type Field = "name" | "email" | "password"

const Signup: React.FC<Props> = ({ switchHandler }) => {
    const nameRef = useRef<string>("")
    const emailRef = useRef<string>("")
    const passwordRef = useRef<string>("")

    const register = useCallback(async(e: MouseEvent) => {
        if(regexMatch("name", nameRef.current) && regexMatch("email", emailRef.current) && regexMatch("password", passwordRef.current)){
            
        }
        else{
            
        }
    }, [])

    const regexMatch = (field: Field, val: string) => {
        if(field === "name"){
            const regex = /^(?!\s*$)[A-Za-z ]*$/
            return val.trim().match(regex)
        }
        else if(field === "email") {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return val.trim().match(regex)
        }
        else {
            const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
            return val.trim().match(regex)
        }
    }

    const validation = (field: Field, val: string) => {
        const input = document.getElementById(field+"-input")
        if(field === "name") {
            if(regexMatch(field, val)) {
                document.getElementById("name-validation-message")?.classList.add('invisible')
                input?.classList.remove('invalid')
                input?.classList.remove('inputs-with-label')
            }
            else {
                document.getElementById("name-validation-message")?.classList.remove('invisible')
                input?.classList.add('invalid')
                input?.classList.add('inputs-with-label')
            }
        }
        else if(field === "email") {
            if(regexMatch(field, val)) {
                document.getElementById("email-validation-message")?.classList.add('invisible')
                input?.classList.remove('invalid')
                input?.classList.remove('inputs-with-label')
            }
            else {
                document.getElementById("email-validation-message")?.classList.remove('invisible')
                input?.classList.add('invalid')
                input?.classList.add('inputs-with-label')
            }
        }
        else {
            if(regexMatch(field, val)) {
                document.getElementById("password-validation-message")?.classList.add('invisible')
                input?.classList.remove('invalid')
                input?.classList.remove('inputs-with-label')
            }
            else {
                document.getElementById("password-validation-message")?.classList.remove('invisible')
                input?.classList.add('invalid')
                input?.classList.add('inputs-with-label')
            }
        }
    }

    return(
        <div id="inner-register-container">
            <p id="registerTitle">REGISTER</p>
            <form>
                <div className="input-container">
                    <input type="text" className="inputs" id="name-input" placeholder="Name" onChange={e => {
                        nameRef.current = e.target.value
                        validation("name", e.target.value)
                    }} />
                    <div>
                        <label id="name-validation-message" className="validation-message invisible" htmlFor="name-input">Enter a valid name</label>
                    </div>
                </div>
                <div className="input-container">
                    <input type="text" className="inputs" id="email-input" placeholder="Email ID" onChange={e => {
                        emailRef.current = e.target.value
                        validation("email", e.target.value)
                    }} />
                    <div>
                        <label id="email-validation-message" className="validation-message invisible" htmlFor="email-input">Enter a valid Email address</label>
                    </div>
                </div>
                <div className="input-container">
                    <input type="password" className="inputs" id="password-input" placeholder="Password" onChange={e => {
                        passwordRef.current = e.target.value
                        validation("password", e.target.value)
                    }} />
                    <ul id="password-validation-message" className="validation-message invisible">
                        <li>Your password should be 8 to 15 characters long</li>
                        <li>At least one number, one uppercase Letter, one lowercase Letter and one special character</li>
                    </ul>
                </div>
                <Button variant="contained" color="inherit" id="register-button" onClick={e => register(e)}>
                    Register
                </Button>
                <p id="login-register">Already have an account? <b id="login-register-link"onClick={() => switchHandler(true)}>Login</b></p>
            </form>
        </div>
    )
}

export default Signup