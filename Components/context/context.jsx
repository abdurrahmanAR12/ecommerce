import React, { createContext, useEffect, useState } from "react";

export const AdminTokenString = "_a_<(8)>tystsspotrtins7afs7n5o2az=";
export let context = createContext();

export function ContextState({ children }) {
    let [loggedIn, setLoggedIn] = useState(false),
        [int, setInt] = useState(null),
        [t, setT] = useState(0),
        [s, setSto] = useState(null);

    useEffect(() => {
        setInt(setInterval(adminCheck, 1000))
        function adminCheck() {
            if (s) {
                if (typeof s[AdminTokenString] === "string") {
                    setLoggedIn(true);
                    clearInterval(int)
                    setInt(null)
                }
                setT(t + 1);
                if (t > 4)
                    clearInterval(int)
            }
        }

        window.onclose = e => {
            localStorage.removeItem(AdminTokenString)
            window.close()
        }

    }, [s])

    useEffect(() => {
        setSto(localStorage);
    }, [])

    return (
        <>
            <context.Provider value={{ loggedIn, s, setLoggedIn }}>
                {children}
            </context.Provider>
        </>
    );
}