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
import './styles/Room.css';

interface PeersRef {
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

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: -drawerWidth,
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
    const [peers, setPeers] = useState<Array<Peer.Instance>>([])
    const peersRef = useRef<Array<PeersRef>>([])
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
            const peers = users.reduce((result: Peer.Instance[], userID: string) => {
                if(userID !== socketRef.current.id){
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer
                    })
                    result.push(peer)
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
            peersRef.current.push({
                peerID: id,
                peer
            })
            setPeers((peers) => [...peers, peer])
        })

        socketRef.current.on("receiving returned signal", (payload: Payload) => {
            console.log("receiving returned signal")
            const { signal, id } = payload
            const item = peersRef.current.find((p: PeersRef) => p.peerID === id);
            if(item){
                item.peer.signal(signal)
            }
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
    
    return(
        <div style={{display: 'flex'}}>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div id="video-grid">
                    {peers.map((peer) => (
                        <Video peer={peer} />
                    ))}
                </div>
                {showChat && <button onClick={() => setOpen(!open)}>open</button>}
                <button onClick={exit}>LEAVE</button>
                <div id="self-video">
                    <video autoPlay playsInline ref={userVideo} />
                </div>
            </main>
            {showChat && <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <ChatBox socket={socketRef.current} />
            </Drawer>}
        </div>
    )
}

export default Room