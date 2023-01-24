import { createContext, useContext, useState } from "react";

export const GlobalContext = createContext()

export function useGlobal() {
    return useContext(GlobalContext)
}

export function GlobalProvider({ children }) {
	const [fullscreen, setFullscreen] = useState(false)

	const enableFullscreen = () => setFullscreen(true)
	const disableFullscreen = () => setFullscreen(false)
	const isFullscreen = () => fullscreen

    const value = {
		enableFullscreen,
		disableFullscreen,
		isFullscreen
    }

	return (
		<GlobalContext.Provider value={value}>
			{children}
		</GlobalContext.Provider>
	)
}
