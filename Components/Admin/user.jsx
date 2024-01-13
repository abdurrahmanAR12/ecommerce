import React from 'react'

export default function User({ user }) {
    return (
        <div className='bg-white rounded-lg my-2 flex items-center p-2'>
            <div className='w-48'>
                <div className="w-full items-center text-sm dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                    <div className="px-2 flex items-center">
                        <div className="text-base">
                            <p className='text-sm my-2 mx-2'>{user.Name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-48'>
                <div className="w-full items-center text-sm dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                    <div className="px-2 flex items-center">
                        <div className="text-base">
                            <p className='text-sm my-2 mx-2'>{user.Email}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-48'>
                <div className="w-full items-center text-sm dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                    <div className="px-2 flex items-center">
                        <div className="text-base">
                            <p className='text-sm my-2 mx-2'>{user.Gender}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-48'>
                <div className="w-full items-center text-sm dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                    <div className="px-2 flex items-center">
                        <div className="text-base">
                            <p className='text-sm my-2 mx-2'>{user.City}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-48'>
                <div className="w-full items-center text-sm dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                    <div className="px-2 flex items-center">
                        <div className="text-base">
                            <p className='text-sm my-2 mx-2'>{user.Age}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-48'>
                <div className="w-full items-center text-sm dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                    <div className="px-2 flex items-center">
                        <div className="text-base">
                            <img src={user.Pic} className='w-12 h-12 rounded-full'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
