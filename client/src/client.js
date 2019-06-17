import { useState, useEffect } from "react";
import { GraphQLClient } from 'graphql-request';
import config from './config';

export const useClient = () => {
  const [token, setToken] = useState("")

  useEffect(() => {
    const tokenId = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
    setToken(tokenId)
  }, []);

  return new GraphQLClient(config.URL, {
    headers: { authorization: token }
  })
}