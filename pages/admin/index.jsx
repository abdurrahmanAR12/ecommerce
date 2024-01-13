import React, { useContext } from 'react'
import Products from './products'
import { context } from '../../Components/context/context'
import Login from '../../Components/Admin/Login';

export default () => {
    let { loggedIn } = useContext(context);
    return (<>
        {loggedIn ? <Index /> : <Login />}
    </>)
}

export function Index() {
    return (
        <div>
            <Products />
        </div>
    )
}
