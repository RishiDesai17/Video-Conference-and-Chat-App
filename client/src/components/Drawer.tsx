import React, { useState } from 'react';
import ChatBox from './ChatBox';
import Members from './Members';
import { Drawer } from '@material-ui/core';
import DrawerMaterialStyles from './styles/DrawerMaterialStyles';
import { Instance } from 'simple-peer';

type Props = {
    showDrawerChildren: boolean,
    open: boolean,
    setOpen: (open: boolean) => void,
    socket: SocketIOClient.Socket
    peers: Peer[]
}

type Peer = {
    peerID: string,
    peer: Instance,
    username: string
}

const DrawerComponent: React.FC<Props> = ({ showDrawerChildren, socket, open, setOpen, peers }) => {
    const [showChatbox, setShowChatbox] = useState<boolean>(true)
    const classes = DrawerMaterialStyles();
    
    return(
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            {showDrawerChildren && 
                <>
                    <div id="backArrow" onClick={() => setOpen(false)}>
                        <svg width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                        </svg>
                    </div>
                    <button onClick={() => setShowChatbox(!showChatbox)}>switch</button>
                    {showChatbox ?
                        <ChatBox socket={socket} close={() => setOpen(false)} />
                    :
                        <Members peers={peers} />
                    }
                </>
            }
        </Drawer>
    )
}

export default React.memo(DrawerComponent)