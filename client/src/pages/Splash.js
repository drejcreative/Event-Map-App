import React, { useContext } from "react";
import { Redirect } from 'react-router-dom'

import Login from '../components/Auth/Login';
import Store from '../store/store';

const Splash = () => {
  const { state } = useContext(Store);
  return state.isAuth ? <Redirect to="/" /> : <Login />;
};

export default Splash;
