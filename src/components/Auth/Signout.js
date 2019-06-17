import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { GoogleLogout } from 'react-google-login';

import { SIGNOUT_USER } from '../../store/action-types';

import Store from '../../store/store';

const Signout = ({ classes }) => {
  const { dispatch } = useContext(Store);

  const onSignout = () => {
    dispatch({
      type: SIGNOUT_USER
    })
  }

  return (
    <GoogleLogout
      onLogoutSuccess={onSignout}
      render={({ onClick }) => (
        <span className={classes.root} onClick={onClick} >
          <ExitToAppIcon className="logout" />
        </span>
      )}
    />
  )
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex",
  },
  buttonText: {
    color: "orange",
    marginLeft: '10px',
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "orange"
  }
};

export default withStyles(styles)(Signout);
