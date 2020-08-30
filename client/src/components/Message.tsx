import React from 'react';

interface Message {
    sender: string,
    message: string
}

interface Props {
    chat: Message
}

const Message: React.FC<Props> = ({ chat }) => {
    return(
        <div>
            <h1>{chat.sender}</h1>
            <p>{chat.message}</p>
        </div>
    )
}

export default Message