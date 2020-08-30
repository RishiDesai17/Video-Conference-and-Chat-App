import React from 'react';
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

    return(
        <div className="messageContainer" id={socketID === sender ? "userMessage" : "recdMessage"}>
            <div id="messageContent">
                <b>{sender}</b>
                <p>{message}</p>
            </div>
        </div>
    )
}

export default Message