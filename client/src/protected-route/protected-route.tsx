import React, { Component, useContext } from 'react';
import { Context } from '../context/Context';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface Props extends RouteProps {
    component: any
}

const ProtectedRoute: React.FC<Props> = ({
    component: Component,
    ...rest
}) => {
    const { state } = useContext(Context)
    return(
        <Route 
            {...rest}
            render = {props => 
                state.loggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    )
}

export default ProtectedRoute;