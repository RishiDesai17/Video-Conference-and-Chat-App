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