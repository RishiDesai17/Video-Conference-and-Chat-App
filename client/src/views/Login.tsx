import React from "react";
import { Button } from '@material-ui/core';
import "./styles/Login.css";

const Login: React.FC = () => {
    return(
        <div id="loginContainer">
            <div id="innerLoginContainer">
                <p id="loginTitle">LOGIN</p>
                <input type="text" className="inputs" placeholder="Username" />
                <input type="password" className="inputs" placeholder="Password" />
                <Button variant="contained" color="inherit" id="loginButton">
                    Login
                </Button>
            </div>
        </div>
    )
}

export default Login