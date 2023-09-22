import React, { createContext } from 'react';

const OmsContext = createContext();

function OmsProvider({children}) {
    const contextData = {
        backendUrl: "http://localhost:3000"
    }

    return (
        <OmsContext.Provider value={contextData}>
            {children}
        </OmsContext.Provider>
    )
}

export {OmsContext, OmsProvider}
