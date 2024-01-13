import React, { useContext } from 'react'
import Sidebar from '../../Components/sidebar'
import { context } from '../../Components/context/context';
import Login from '../../Components/Admin/Login';

export default () => {
  let { loggedIn } = useContext(context);
  return <>{loggedIn ? <Analytics /> : <Login />}</>
}

function Analytics() {
  return (
    <div className='bg-gradient-to-b from-blue-900 from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0'>
      <Sidebar />
    </div>
  );
}
