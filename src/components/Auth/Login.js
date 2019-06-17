import React, { useContext } from "react";
import { GraphQLClient } from 'graphql-request';
import { withStyles } from "@material-ui/core/styles";
import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login';

import Store from '../../store/store';
import config from '../../config';

import { LOGIN_USER, IS_LOGGED_IN } from '../../store/action-types';
import { ME_QUERY } from '../../graphql/queries';

import './Login.scss';

import backgroundImage from '../../assets/images/bckgrnd.jpg';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Store);

  const responseGoogle = async googleUser => {
    try {
      const token = await googleUser.getAuthResponse().id_token;

      const client = new GraphQLClient(config.URL, {
        headers: { authorization: token }
      })
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: LOGIN_USER, payload: me })
      dispatch({ type: IS_LOGGED_IN, payload: googleUser.isSignedIn() })
    } catch (error) {
      responseFail(error);
    }
  }

  // const responseFacebook = async response => {
  //   const token = await response.accessToken;
  //   // const client = new GraphQLClient(config.URL, {
  //   //   headers: { authorization: token }
  //   // })
  //   // const { me } = await client.request(ME_QUERY);
  //   console.log(response);

  // }

  const responseFail = response => {
    console.error(response)
    dispatch({ type: IS_LOGGED_IN, payload: false })
  };

  return (
    <div className={classes.root} >
      <div className="login-wrap">
        <div className="login">
          <h2 className="login__header">Airsoft <span>Susreti</span></h2>
          <p className="login__subheader">Spisak Airsoft susreta</p>
          <GoogleLogin
            clientId={config.CLIENT_ID}
            buttonText="Login with your Gmail"
            onSuccess={responseGoogle}
            onFailure={responseFail}
            theme="Light"
            isSignedIn={true}
          />

          {/* <FacebookLogin
            appId={config.FACEBOOK_ID}
            fields="name, email, picture"
            autoLoad={true}
            callback={responseFacebook}
          /> */}
        </div>
      </div>
    </div>
  )
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    backgroundImage: `linear-gradient(0deg, rgba(2, 2, 2, 0.9) 0%, rgba(255,255,255,.3) 70%), url(${backgroundImage})`,
    backgroundSize: 'cover',
  },
};

export default withStyles(styles)(Login);
