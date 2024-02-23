'use client'

import { Button } from "./ui/button"
export const Login = () => {

  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_YGGIO_REDIRECT_URI}`)
  const clientId = encodeURIComponent(`${process.env.NEXT_PUBLIC_YGGIO_CLIENT_ID}`)
  const url = `${process.env.NEXT_PUBLIC_AUTHORIZATION_ENDPOINT}/?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`


  const handleLogin = () => {
    window.location.href = url
  }

  return (
    <Button onClick={handleLogin}>login</Button>
  )
}
