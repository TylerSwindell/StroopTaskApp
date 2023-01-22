import { useContext, useState, useEffect, createContext } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth"
import { auth } from "../firebase-config"

export const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  function loginCheck() {
    onAuthStateChanged(auth, (user) => {
        // See docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;
        if (user) setIsLoggedIn(true) // User is signed in 
        else setIsLoggedIn(false)     // User is signed out
    });
    return isLoggedIn
  }

  function signupAuth(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function loginAuth(email, password) {
    setIsLoggedIn(true)
    signInWithEmailAndPassword(auth,email, password)
    return
  }

  function logoutAuth() {
    setIsLoggedIn(false)
    signOut(auth)
    return
  }

  function resetAuthPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  function updateAuthEmail(email) {
    return updateEmail(currentUser, email)
  }

  function updateAuthPassword(password) {
    return updatePassword(currentUser, password)
  }

  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      setLoading(false)
    })
  }, [])

  const value = {
    currentUser,
    isLoggedIn,
    loginAuth,
    signupAuth,
    logoutAuth,
    resetAuthPassword,
    updateAuthEmail,
    updateAuthPassword,
    loginCheck
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}