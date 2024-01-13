import Head from 'next/head';
import Script from 'next/script';
import Navbar from '../Components/Navbar';
import { Products } from '../Components/Products';

export default function Home() {
  return (
    <>
      <Navbar />
      <Products />
      <Script src='/js/flowbite.js' />
    </>
  );
}
