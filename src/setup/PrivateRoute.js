import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/auth-context/AuthContext"

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth()

  return (
    currentUser ? <Outlet/> : <Navigate to="/login"/>
  )
}