import React, { useEffect, useRef, useState, useCallback, useContext } from "react";
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { useHistory } from 'react-router-dom';
import * as queryString from 'query-string';
import Video from '../components/Video';
import { Context } from "../context/Context";
import ChatBox from "../components/ChatBox";
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Drawer } from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import './styles/Room.css';

interface Peers {
    peerID: string,
    peer: Peer.Instance
}

interface Payload {
    signal: any,
    id: string
}

interface Message {
    sender: string,
    message: string
}

const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: drawerWidth,
      [theme.breakpoints.down('xs')]: {
        marginRight: '100%'
      },
    },
    title: {
      flexGrow: 1,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      [theme.breakpoints.down('xs')]: {
        width: '100%'
      },
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      ...theme.mixins.toolbar,
      justifyContent: 'flex-start',
    },
    content: {
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: -drawerWidth,
      [theme.breakpoints.down('xs')]: {
        width: 0
      },
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    },
  }),
);

const Room: React.FC = (props) => {
    const userVideo = useRef<HTMLVideoElement>(document.createElement('video'))
    const userStream = useRef<MediaStream>()
    const socketRef = useRef<SocketIOClient.Socket>(io.Socket)
    const [peers, setPeers] = useState<Array<Peers>>([])
    const peersRef = useRef<Array<Peers>>([])
    const [showChat, setShowChat] = useState<boolean>(false)
    const [open, setOpen] = useState(false);
    const context = useContext(Context)
    const history = useHistory()
    const classes = useStyles();

    useEffect(() => {
        init()
    }, [])

    const init = useCallback(async() => {
        socketRef.current = io.connect("/")
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        userVideo.current.srcObject = userStream.current = stream
        // const queryParams: queryString.ParsedQuery<string> = queryString.parse(window.location.search)
        // console.log(queryParams.room)
        if(context.state.host){
            socketRef.current.emit("start meet")
            socketRef.current.on("roomID", (roomID: string) => {
                console.log(roomID)
            })
        }
        else{
            const queryParams: queryString.ParsedQuery<string> = queryString.parse(window.location.search)
            console.log(queryParams.room)
            if(!queryParams.room || typeof queryParams.room !== 'string'){
                alert("Enter a valid url")
                exit()
                return;
            }
            socketRef.current.emit("join room", queryParams.room)
            socketRef.current.on("invalid room", () => {
                alert("Invalid room")
                exit()
                return;
            })
            socketRef.current.on("room full", () => {
                alert("Room full")
                exit()
                return;
            })
        }
        setShowChat(true)
        socketRef.current.on("all users", (users: string[]) => {
            const peers = users.reduce((result: Peers[], userID: string) => {
                if(userID !== socketRef.current.id){
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    const peerObj = {
                        peerID: userID,
                        peer
                    }
                    peersRef.current.push(peerObj)
                    result.push(peerObj)
                }
                return result
            }, [])
            console.log(peers)
            setPeers(peers)
        })

        socketRef.current.on("user joined", (payload: Payload) => {
            console.log("user joined")
            const { signal, id } = payload
            const peer = addPeer(signal, id, stream)
            const peerObj = {
                peerID: id,
                peer
            }
            peersRef.current.push(peerObj)
            setPeers(peers => [...peers, peerObj])
        })

        socketRef.current.on("receiving returned signal", (payload: Payload) => {
            console.log("receiving returned signal")
            const { signal, id } = payload
            const item = peersRef.current.find((p: Peers) => p.peerID === id);
            if(item){
                item.peer.signal(signal)
            }
        })
        socketRef.current.on("disconnected", (id: string) =>{
            disconnected(id)
        })
    }, [])

    const createPeer = (userToSignal: string, callerID: string, stream: MediaStream) => {
        console.log("create peer")
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        })

        peer.on("signal", (signal) => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer
    }

    const addPeer = (incomingSignal: any, callerID: string, stream: MediaStream) => {
        console.log("add peer")
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        })
        peer.on("signal", (signal) => {
            console.log(signal)
            socketRef.current.emit("returning signal", { signal, callerID })
        })
        peer.signal(incomingSignal)
        return peer
    }

    const exit = () => {
        socketRef.current.disconnect()
        history.replace("/")
        userStream.current?.getTracks().forEach((track) => {
            track.stop();
        });
    }

    const disconnected = (id: string) => {
        alert(id + "left the chat")
        peersRef.current = peersRef.current.filter(peer => peer.peerID !== id)
        setPeers(peers.filter(peer => peer.peerID !== id))
    }
    
    return(
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
                })}
                style={{height: 50}}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={() => setOpen(true)}
                        className={clsx(open && classes.hide)}
                        style={{ position: 'absolute', right: 20, top: 1 }}
                    >
                        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M2 1h12a1 1 0 0 1 1 1v11.586l-2-2A2 2 0 0 0 11.586 11H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
                            <path fill-rule="evenodd" d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <div id="video-grid">
                    {peers.map((peer) => (
                        <Video peer={peer.peer} />
                    ))}
                </div>
                {showChat && <button style={{zIndex: 1001}} onClick={() => setOpen(!open)}>open</button>}
                <button onClick={exit}>LEAVE</button>
                <div id="self-video">
                    <video autoPlay playsInline ref={userVideo} />
                </div>
            </main>
             <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                {showChat && <ChatBox socket={socketRef.current} close={() => setOpen(false)} />}
            </Drawer>
        </div>
    )
}

export default Room