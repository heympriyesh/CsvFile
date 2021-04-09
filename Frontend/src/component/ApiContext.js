import React, { useState, createContext } from 'react';

export const ApiContext = createContext();


export const ApiProvider = (props) => {
    const [truevalue, settruevalue] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    // const [drop, setDrop] = useState();
    return (
        <ApiContext.Provider value={{ truevalue, settruevalue, isAuth, setIsAuth}}>
            {props.children}
        </ApiContext.Provider>
    )
}