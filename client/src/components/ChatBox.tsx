import React, { useRef, useState, useCallback, useEffect, MouseEvent } from 'react';
import Message from "./Message";
import './styles/ChatBox.css'

type Props = {
    socket: SocketIOClient.Socket
    close: () => void
}

type Chat = {
    sender: string,
    message: string
}

const ChatBox: React.FC<Props> = ({ socket, close }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [chats, setChats] = useState<Array<Chat>>([])

    useEffect(() => {
        socket.on("receive-message", (payload: Chat) => {
            console.log("recd")
            addToChat(payload)
        })
    }, [])

    const sendMessage = (e: MouseEvent) => {
        e.preventDefault()
        console.log("send")
        if(inputRef.current && inputRef.current?.value !== ""){
            const val = inputRef.current?.value
            socket.emit("message", val)
            const chatObj = {
                sender: socket.id,
                message: val
            }
            addToChat(chatObj)
            inputRef.current.value = ""
        }
    }

    const addToChat = useCallback((chatObj: Chat) => {
        console.log("add")
        setChats(chats => [...chats, chatObj])
    }, [])

    return(
        <div id="chatbox">
            {/* <h1>Chat</h1> */}
            <div id="backArrow" onClick={close}>
                <svg width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                </svg>
            </div>
            <div id="messagesContainer">
                {chats.map((chat, index) => (
                    <Message key={index} chat={chat} socketID={socket.id} />
                ))}
            </div>
            <div id="input">
                <form>
                    <input ref={inputRef} />
                    <button type="submit" onClick={(e) => sendMessage(e)}>SEND</button>
                </form>
            </div>
        </div>
    )
}

export default ChatBox