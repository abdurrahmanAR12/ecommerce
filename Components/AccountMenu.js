import { Menu, MenuItem, Button } from "@material-ui/core"
import { TextField } from "@material-ui/core"
import React, { useMemo } from "react";
// import dynamic from "next/dynamic"
import Link from "next/link";

// let Router = dynamic(() => import("next/router",))

export default function AccountMenu({ open, handleClose, inputValue, onChange, getSugessions, results, anchorEl }) {
    useMemo(() => { getSugessions() }, [inputValue]);
    // function push() {
    //     Router.push(`/results?key=${inputValue}`)
    // }
    return (
        <React.Fragment>
            <Menu style={{ width: "100%" }}
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    variant: "elevation",
                    elevation: 10,
                    sx: {
                        width: 350,
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
            // transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            // anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <ul className="h-48 pt-2 w-96 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownSearchButton" id="search-results">
                    <div className="flex h-12">
                        <TextField value={inputValue} onChange={onChange} fullWidth color="primary" variant="outlined" type='text' label="Search here..." />
                        <Link href={`/results?key=${inputValue}`}>
                            <Button variant='contained'>
                                Go
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-6">
                        {Array.isArray(results) ? results.map(result => {
                            return <MenuItem onClick={handleClose}>
                                {result}
                            </MenuItem>
                        }) : <p className='text-center text-sm'> {results}</p>}
                    </div>
                </ul>
            </Menu >
        </React.Fragment >
    );
}