import { createContext, useContext, useState } from "react";

export const GlobalContext = createContext()

export function useGlobal() {
    return useContext(GlobalContext)
}

export function GlobalProvider({ children }) {
	const [userData, setUserData] = useState(null)

    const value = {
		userData, setUserData
    }

	return (
		<GlobalContext.Provider value={value}>
			{children}
		</GlobalContext.Provider>
	)
}
