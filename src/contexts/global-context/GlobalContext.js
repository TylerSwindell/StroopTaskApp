import { createContext, useContext, useState } from "react";
import { testMode } from "../../config/MainConfig";

export const GlobalContext = createContext()

export function useGlobal() {
    return useContext(GlobalContext)
}

export function GlobalProvider({ children }) {
	const [fullscreen, setFullscreen] = useState(false)
	const [isInTestMode, setTestMode] = useState(testMode)

	const enableFullscreen = () => setFullscreen(true)
	const disableFullscreen = () => setFullscreen(false)
	const isFullscreen = () => fullscreen
	const enableTestMode = () => setTestMode(true)
	const disableTestMode = () => setTestMode(false)
	const toggleTestMode = () => setTestMode((prev) => !prev)


    const value = {
		enableFullscreen,
		disableFullscreen,
		isFullscreen,
		enableTestMode,
		disableTestMode,
		toggleTestMode,
		isInTestMode
    }

	return (
		<GlobalContext.Provider value={value}>
			{children}
		</GlobalContext.Provider>
	)
}
