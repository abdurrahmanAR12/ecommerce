import Router from 'next/router';
import React, { useState, useEffect } from 'react'


export default function view() {
    let [products, setProducts] = useState({ loading: false, page: 0, hasMore: true, values: [] }),
        [query, setQ] = useState(null),
        [_404, set404] = useState(false),
        [interval, setInt] = useState(null),
        [keys, setKeys] = useState([]);

    useEffect(() => {
        function func() {
            if (Object.keys(Router.default.router.state.query).length) {
                if (!query)
                    setQ(Router.default.router.state.query);
                clearInterval(interval);
            }
        }
        setInt(setInterval(func, 1000));
    }, [])

    useEffect(() => {
        if (query) {
            // setProducts({ ...products, page: query.page ? query.page : 0 });
            // getProducts()
        };
    }, [query])
    return (
        <div>

        </div>
    )
}
