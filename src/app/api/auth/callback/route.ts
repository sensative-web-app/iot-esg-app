
export async function GET(request: Request) {
  const clientID = process.env.NEXT_PUBLIC_YGGIO_CLIENT_ID!
  const clientSecret = process.env.YGGIO_CLIENT_SECRET!
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code') || ''
  const redirectUri = process.env.NEXT_PUBLIC_YGGIO_REDIRECT_URI || ''

  // Ensure this code runs in an async function or handler
  const response = await fetch('https://staging.yggio.net/auth/realms/yggio/protocol/openid-connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code, // Ensure 'code' is defined and valid
      redirect_uri: redirectUri, // Ensure 'redirectUri' is correctly assigned
      client_id: clientID, // Adjusted for server-side variable
      client_secret: clientSecret // Adjusted for server-side variable
    })
  });



  const data = await response.json()
  console.log(data)



  return new Response('Hello world')
}
