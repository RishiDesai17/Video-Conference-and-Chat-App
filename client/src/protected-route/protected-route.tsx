import React, { useCallback } from 'react';
import useStore from '../zustand/store';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface Props extends RouteProps {
    component: any
}

const ProtectedRoute: React.FC<Props> = ({
    component: Component,
    ...rest
}) => {
    const loggedIn = useStore(useCallback(state => state.loggedIn, []))
    return(
        <Route 
            {...rest}
            render = {props => 
                loggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    )
}

export default ProtectedRoute;