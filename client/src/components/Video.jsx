import React, { useEffect, useRef } from "react";
// import Peer from 'simple-peer';

// interface Props {
//     peer: Peer.Instance
// }

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", (stream) => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <video autoPlay playsInline ref={ref} />
    );
}

export default Video