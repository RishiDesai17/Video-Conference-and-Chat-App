import React, { useRef, useState } from 'react';

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
        <div id="chatbox">
            <h1>Chat</h1>
            <button onClick={close}>CLOSE</button>
            {chats.map(chat => (
                <div>
                    <h1>{chat.sender}</h1>
                    <p>{chat.message}</p>
                </div>
            ))}
            <input ref={inputRef} />
            <button onClick={sendMessage}>SEND</button>
        </div>
    )
}

export default ChatBox