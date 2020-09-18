import React, { useMemo } from 'react';
import './styles/Message.css';

interface Message {
    sender: string,
    message: string
}

interface Props {
    chat: Message,
    socketID: string
}

const Message: React.FC<Props> = ({ chat, socketID }) => {
    const { sender, message } = chat

    const sentByMe = useMemo(() => {
        return socketID === sender
    }, [])

    return(
        <div className="messageContainer" id={sentByMe ? "userMessage" : "recdMessage"}>
            <div id="messageContent">
                {!sentByMe && <b>{sender}</b>}
                <p>{message}</p>
            </div>
        </div>
    )
}

export default React.memo(Message)