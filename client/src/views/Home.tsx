import React, { useRef } from "react";
import { Grid, Button, Paper } from '@material-ui/core';
import Header from "../components/Header";

const Home: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null)

    const startMeet = async() => {
        window.open(`/room?host=${true}`)
    }

    const joinRoom = () => {
        if(inputRef.current?.value !== ""){
            window.open(`/room?room=${inputRef.current?.value}`)
        }
    }

    return(
        <>
            {/* <Header  /> */}
            <Grid container style={{ position: 'absolute', top: '40%', transform: 'translateY(-50%)', backgroundColor: '#DCDCDC', marginLeft: '12.5%', marginRight: '12.5%', width: '75%', border:'1px solid #888888', borderRadius: 5 }}>
                <Grid item md={6} sm={12} xs={12}>
                    <div>
                        <div style={{ margin: 40 }}>
                            <h4>Start a new Meeting</h4>
                        </div>
                        <div style={{ margin: 40 }}>
                            <Button variant="contained" color="primary" onClick={startMeet}>
                                Host Meeting
                            </Button>
                        </div>
                    </div>
                </Grid>
                {/* <Grid item md={2} sm={12} xs={12} style={{ justifyContent: 'center' }}>
                    <p>OR</p>
                </Grid> */}
                <Grid item md={6} sm={12} xs={12}>
                    <div style={{ margin: 40 }}>
                        <h4>Join a meeting</h4>
                    </div>
                    <div style={{ margin: 40 }}>
                        <input ref={inputRef} style={{ margin: 10, height: 30, paddingLeft: 10, paddingRight: 10 }} placeholder="Enter URL or Room ID" />
                        <Button variant="contained" style={{ backgroundColor: 'green', color:'white', margin: 10 }} onClick={joinRoom}>
                            JOIN
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </>
    )
}

export default Home