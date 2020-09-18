import React from 'react';
import { Instance } from 'simple-peer';

type Props = {
    peers: Peer[]
}

type Peer = {
    peerID: string,
    peer: Instance,
    username: string
}

const Members: React.FC<Props> = ({ peers }) => {
    return(
        <>
            <h1>Members</h1>
            {peers.map(peer => (
                <p>{peer.username}</p>
            ))}
        </>
    )
}

export default Members