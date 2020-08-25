import React, { useRef, useState } from 'react';
import io from "socket.io-client";

interface Props {
    socket: SocketIOClient.Socket
}

interface Chat {
    sender: string,
    message: string
}

const ChatBox: React.FC<Props> = ({ socket }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [chats, setChats] = useState<Array<Chat>>([])

    const sendMessage = () => {
        if(inputRef.current && inputRef.current?.value !== ""){
            const val = inputRef.current?.value
            socket.emit("message", val)
            setChats([...chats, {
                sender: socket.id,
                message: val
            }])
        }
    }

    socket.on("receiveMsg", (payload: Chat) => {
        setChats([...chats, payload])
    })

    return(
        <>
            <h1>Chat</h1>
            {chats.map(chat => (
                <div>
                    <h1>{chat.sender}</h1>
                    <p>{chat.message}</p>
                </div>
            ))}
            <input ref={inputRef} />
            <button onClick={sendMessage}>SEND</button>
        </>
    )
}

export default ChatBox