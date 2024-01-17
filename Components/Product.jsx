import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Typography, IconButton } from '@mui/material';
import { PlusOne, Minimize } from '@mui/icons-material';


export function Product({ id, Stock, Price, Description, Name, Pic }) {
    let [product, setProduct] = useState({ quantity: 1 })
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };
    useEffect(() => console.log(id), [])
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div className="product p-2 best-shadow rounded-lg">
                <img className="h-auto w-full my-2 rounded-lg"
                    src={Pic ? Pic[0] : ""} alt="" />
                <div className="best-shadow px-2 py-2 rounded-lg">
                    <h1 className="text-2xl font-semibold">
                        {Name}
                    </h1>
                    {/* <p className="mb-4 text-sm">
                        {Description.length > 46 ? `${Description.slice(0, 46)}...` : Description}
                    </p> */}
                    <Box sx={{ pr: 2, mb: 2 }}>
                        <Typography variant="body2">
                            {Description.length > 46 ? `${Description.slice(0, 46)}...` : Description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {`${Stock} items • Rs. ${Price}`}
                        </Typography>
                    </Box>
                    <Link href={"/checkout?id=" + id}>
                        <Button >
                            Buy Now
                        </Button>
                        {/* <span role='button'
                            className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                            <span className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Buy Now
                            </span>
                        </span> */}
                    </Link>
                    <Button onClick={handleClickOpen}>
                        Add to Cart
                    </Button>
                    {/* <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        <span onClick={handleClickOpen} className="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Add to Cart
                        </span>
                    </button > */}
                </div>
            </div>
            <ResponsiveDialog open={open} quantity={product.quantity} setProduct={setProduct} handleClose={handleClose} fullScreen={fullScreen} />
        </>
    );
}

function ResponsiveDialog({ fullScreen, handleClose, open, quantity, setProduct }) {
    const buttons = [
        <Button key={"one"} onClick={() => setProduct({ quantity: quantity <= 1 ? quantity : quantity - 1 })}>
            <Minimize />
        </Button>,
        <Button disabled key="two">{quantity}</Button>,
        <Button onClick={() => setProduct({ quantity: quantity + 1 })} key="three"        >
            <PlusOne />
        </Button>
    ];
    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"How much items to get?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select the items to add
                    </DialogContentText>
                </DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '& > *': {
                            m: 1,
                        },
                    }}
                >
                    <ButtonGroup size="small" aria-label="small button group">
                        {buttons}
                    </ButtonGroup>
                </Box>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleClose} autoFocus>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
