import React, { useRef, useState, useCallback } from 'react';
import Message from "./Message";
import './styles/ChatBox.css'

interface Props {
    socket: SocketIOClient.Socket
    close: () => void
}

interface Chat {
    sender: string,
    message: string
}

const ChatBox: React.FC<Props> = ({ socket, close }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [chats, setChats] = useState<Array<Chat>>([])

    const sendMessage = () => {
        if(inputRef.current && inputRef.current?.value !== ""){
            const val = inputRef.current?.value
            socket.emit("message", val)
            const chatObj = {
                sender: socket.id,
                message: val
            }
            addToChat(chatObj)
        }
    }

    const addToChat = useCallback((chatObj: Chat) => {
        setChats([...chats, chatObj])
    }, [])

    socket.on("receiveMsg", (payload: Chat) => {
        setChats([...chats, payload])
    })

    return(
        <div id="chatbox">
            <h1>Chat</h1>
            <button onClick={close}>CLOSE</button>
            {chats.map((chat, index) => (
                <Message key={index} chat={chat} />
            ))}
            <div id="input">
                <input ref={inputRef} />
                <button onClick={sendMessage}>SEND</button>
            </div>
        </div>
    )
}

export default ChatBox