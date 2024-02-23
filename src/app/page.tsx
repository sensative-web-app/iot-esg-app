import { Login } from "@/components/login"
const yggioConnect = require('yggio-connect');

export default function Home() {

  // const config = {
  //   url: 'https://staging.yggio.net',
  //   account: {
  //     username: 'ek223ur',
  //     password: 'pItna6-savsih-cuxqum'
  //   },
  //   provider: {
  //     name: 'iot-esg-app-2',
  //     info: 'iot-esg-app-2',
  //     redirectUris: 'http://localhost:3000/api/auth/callback'
  //   },
  //   refreshCallback: async () => {
  //       // save the refreshToken for the user is generally what you want to
  //       // do here, such as:
  //       return User.findById(refreshedUser._id).exec()
  //         .then(user => {
  //           user.refreshToken = refreshedUser.refreshToken;
  //           return user.save();
  //         });
  //     },
  // }
  return (
    <div className='text-primary'>

      <Login />

    </div>
  )
}
