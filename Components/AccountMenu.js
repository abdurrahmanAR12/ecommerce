import { Menu, MenuItem, Button } from "@material-ui/core"
import { TextField } from "@material-ui/core"
import React, { useMemo } from "react";
// import dynamic from "next/dynamic"
import Autosuggest from "../Components/AutoSuggest";
// let Router = dynamic(() => import("next/router",))

export default function AccountMenu({ open, handleClose, _key, anchorEl }) {
    return (
        <React.Fragment>
            <Menu style={{ width: "100%" }}
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    className: "h-48 px-2 pt-2 rounded-lg w-96 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200",
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
            >
                <div className="h-12">
                    <Autosuggest _key={_key} />
                </div>
            </Menu >
        </React.Fragment >
    );
}