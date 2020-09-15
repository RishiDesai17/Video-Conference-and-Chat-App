import React from 'react';
import ChatBox from './ChatBox';
import { Drawer } from '@material-ui/core';
import DrawerMaterialStyles from './styles/DrawerMaterialStyles';

type Props = {
    isChatbox: boolean,
    showDrawer: boolean,
    open: boolean,
    setOpen: (open: boolean) => void,
    socket: SocketIOClient.Socket
}

const DrawerComponent: React.FC<Props> = ({ isChatbox, showDrawer, socket, open, setOpen }) => {
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
            {showDrawer && 
                <>
                    {isChatbox ?
                        <ChatBox socket={socket} close={() => setOpen(false)} />
                    :
                        <h1>Members</h1>
                    }
                </>
            }
        </Drawer>
    )
}

export default React.memo(DrawerComponent)