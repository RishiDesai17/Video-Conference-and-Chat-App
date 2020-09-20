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

const ChatBox: React.FC<Props> = ({ socket }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [chats, setChats] = useState<Array<Chat>>([])

    useEffect(() => {
        socket.on("receive-message", (payload: Chat) => {
            console.log("recd")
            addToChat(payload)
        })
    }, [])

    const sendMessage = useCallback((e: MouseEvent) => {
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
    }, [])

    const addToChat = useCallback((chatObj: Chat) => {
        console.log("add")
        setChats(chats => [...chats, chatObj])
    }, [])

    return(
        <div id="chatbox">
            {/* <h1>Chat</h1> */}
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