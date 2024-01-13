import Head from 'next/head';
import Script from 'next/script';
import Navbar from '../Components/Navbar';
import { Products } from '../Components/Products';

export async function getServerSideProps(ctx) {
  let { decodeUtf8 } = require('../utils/utils'),
    { Product } = require('../Models/Product'),
    { Image } = require('../Models/Image'),
    { Category } = require('../Models/Category'),
    prods = await Product.find().limit(8);
  // page = parseInt(req.query["page"]),

  async function GenerateProduct(cat, decode = true, id = true) {
    if (Array.isArray(cat)) {
      let pusher = [];
      for (let i = 0; i < cat.length; i++) {
        let c = cat[i], Pic = [];
        for (let i = 0; i < c.Pic.length; i++) {
          let p = await Image.findById(c.Pic[i]);
          Pic[Pic.length] = (`/images?id=${p.route}`)
        }
        pusher[pusher.length] = (new Object({
          Name: decode ? decodeUtf8(c.Name) : c.Name,
          Category: (await Category.findById(c.Category)).Name,
          Pic,
          Price: c.Price,
          Description: decode ? decodeUtf8(c.Description) : c.Description,
          Stock: c.Stock,
          OverView: (c.OverView),
          route: c.route ? c.route : null
        }));
      }
      return pusher;
    }
    if (typeof (cat) === "object") {
      let c = cat, Pic = [];
      for (let i = 0; i < c.Pic.length; i++) {
        let p = await Image.findById(c.Pic[i]);
        Pic.push(`/images?id=${p.route}`)
      }
      return (new Object({
        Name: decode ? decodeUtf8(c.Name) : c.Name,
        Category: (await Category.findById(c.Category)).Name,
        Pic,
        Price: c.Price,
        Description: decode ? decodeUtf8(c.Description) : c.Description,
        Stock: c.Stock,
        OverView: (c.OverView),
        route: c.route ? c.route : null
      }));
    }
    console.log("Invalid argument ", cat);
    return new Object({});
  }

  function generateCategory(cat, decode = true, id = false, type = false) {
    if (Array.isArray(cat)) {
      let pusher = [];
      for (let i = 0; i < cat.length; i++) {
        let c = cat[i];
        pusher.push(new Object({ Name: decode ? decodeUtf8(c.Name) : c.Name, Type: type ? decode ? decodeUtf8(c.Type) : c.Type : null }))
      }
      return pusher;
    }
    if (typeof (cat) === "object")
      return new Object({ Name: decode ? decodeUtf8(cat.Name) : cat.Name, Type: type ? decode ? decodeUtf8(cat.Type) : cat.Type : null })

    console.log("Invalid argument ", cat);
    return new Object({});
  }
  // console.log((await Category.find()))
  return { props: { categories: generateCategory(await Category.find(), true, false), initialProducts: await GenerateProduct(prods) } };
}

export default function Home({ initialProducts, categories }) {
  return (
    <>
      <Navbar categories={categories} />
      <Products initialProducts={initialProducts} />
      <Script src='/js/flowbite.js' />
    </>
  );
}
