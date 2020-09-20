import React from 'react';
import clsx from 'clsx';
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import ChatIcon from '../icons/ChatIcon';
import HeaderMaterialstyles from './styles/HeaderMaterialstyles';

type Props = {
    setOpen: (open: boolean) => void,
    showDrawerChildren: boolean,
    open: boolean
}

const Header: React.FC<Props> = ({ open, setOpen, showDrawerChildren }) => {
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
                    {showDrawerChildren && <ChatIcon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default React.memo(Header)