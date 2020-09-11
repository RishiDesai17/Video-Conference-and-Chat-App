import React, { useRef, useCallback, MouseEvent } from "react";
import { Button } from '@material-ui/core';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import useStore from '../zustand/store';
import useWillMount from '../custom hooks/useWillMount';
import './styles/Register.css';

type Field = "name" | "email" | "password"

const Signup: React.FC = () => {
    const nameRef = useRef<string>("")
    const emailRef = useRef<string>("")
    const passwordRef = useRef<string>("")
    const loggedIn = useStore(useCallback(state => state.loggedIn, []))
    const history = useHistory()

    useWillMount(() => {
        if(loggedIn){
            history.replace("/")
        }
    }, loggedIn)

    const register = async(e: MouseEvent) => {
        e.preventDefault()
        try{
            if(registerValidation()){
                const response = await axios.post('api/users/register', 
                    JSON.stringify({
                        name: nameRef.current,
                        email: emailRef.current,
                        password: passwordRef.current
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                console.log(response.data)
            }
            else{
                alert("Fill the given fields appropriately")
            }
        }
        catch(err){
            console.log(err)
        }
    }

    const registerValidation = useCallback(() => {
        return (regexMatch("name", nameRef.current) && regexMatch("email", emailRef.current) && regexMatch("password", passwordRef.current))
    }, [])

    const regexMatch = useCallback((field: Field, val: string) => {
        if(field === "name"){
            const regex = /^[A-Za-z ]{1,25}$/
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
    }, [])

    const validation = useCallback((field: Field, val: string) => {
        const input = document.getElementById(field + "-input")
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
    }, [])

    return(
        <div id="register-container">
            <div id="inner-register-container">
                <p id="registerTitle">REGISTER</p>
                <form>
                    <div className="input-container">
                        <input type="text" className="inputs" id="name-input" placeholder="Name" onChange={e => {
                            nameRef.current = e.target.value
                            validation("name", e.target.value)
                        }} />
                        <div>
                            <label id="name-validation-message" className="validation-message invisible" htmlFor="name-input">Enter a valid name lesser than 25 characters</label>
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
                    <p id="login-register">Already have an account? {" "}
                        <Link to="/login" className="link">
                            <b id="login-register-link">Login</b>
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Signup