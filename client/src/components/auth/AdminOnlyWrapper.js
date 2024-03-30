import React from "react";
import { useAuthUser } from 'react-auth-kit'

const AdminOnlyWrapper = ({ children }) => {
  // Wrapper for components that should only be accessible to admins and otherwsise not be rendered

  const auth = useAuthUser()

  if (auth() && auth().role === 'ADMIN') {
    return children
  }
  return null
}

export default AdminOnlyWrapper
