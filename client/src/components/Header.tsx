import React from 'react';
import clsx from 'clsx';
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import ChatIcon from '../icons/ChatIcon';
import HeaderMaterialstyles from './styles/HeaderMaterialstyles';

interface Props {
    setOpen: (open: boolean) => void,
    showChat: boolean
}

const Header: React.FC<Props> = ({ setOpen, showChat }) => {
    const classes = HeaderMaterialstyles()

    return(
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
            })}
            // style={{ height: 50 }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="end"
                    onClick={() => setOpen(true)}
                    className={clsx(open && classes.hide)}
                    style={{ position: 'absolute', right: 20, top: 1 }}
                >
                    {showChat && <ChatIcon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Header