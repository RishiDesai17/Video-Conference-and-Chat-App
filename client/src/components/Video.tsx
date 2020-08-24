import React, { useEffect, useRef } from "react";
import Peer from 'simple-peer';

interface Props {
    peer: Peer.Instance
}

const Video: React.FC<Props> = (props) => {
    const ref = useRef<HTMLVideoElement>(document.createElement('video'));

    useEffect(() => {
        props.peer.on("stream", (stream: MediaStream) => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <video autoPlay playsInline ref={ref} />
    );
}

export default Video