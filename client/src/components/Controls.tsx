import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import './styles/Controls.css';
import AudioIcon from '../icons/AudioIcon';
import VideoIcon from '../icons/VideoIcon';

interface Props {
    exit: () => void
}

const Controls: React.FC<Props> = ({ exit }) => {
    const [audio, setAudio] = useState(true)
    const [video, setVideo] = useState(true)

    const audioHandler = () => {
        setAudio(!audio)
    }

    const videoHandler = () => {
        setVideo(!video)
    }

    return(
        <Container>
            <div id="controls-container">
                <div className="controls" onClick={audioHandler}>
                    <AudioIcon isMute={!audio} />
                </div>
                <div className="controls" onClick={videoHandler}>
                    <VideoIcon showVideo={video} />
                </div>
                <div onClick={exit} className="controls" id="disconnect">
                    <svg id="hang-up" width="2em" height="2em" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M2.267.98a1.636 1.636 0 0 1 2.448.152l1.681 2.162c.309.396.418.913.296 1.4l-.513 2.053a.636.636 0 0 0 .167.604L8.65 9.654a.636.636 0 0 0 .604.167l2.052-.513a1.636 1.636 0 0 1 1.401.296l2.162 1.681c.777.604.849 1.753.153 2.448l-.97.97c-.693.693-1.73.998-2.697.658a17.47 17.47 0 0 1-6.571-4.144A17.47 17.47 0 0 1 .639 4.646c-.34-.967-.035-2.004.658-2.698l.97-.969z"/>
                    </svg>
                </div>
            </div>
        </Container>
    )
}

export default Controls