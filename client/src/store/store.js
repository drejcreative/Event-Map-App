import { createContext } from 'react';

const Store = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
  mapTheme: 'streets-v10',
  pins: [],
  popup: null,
  currentPin: null
})

export default Store;