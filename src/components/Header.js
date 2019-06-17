import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Terrain from "@material-ui/icons/Terrain";
import Typography from "@material-ui/core/Typography";

import Store from '../store/store';
import Signout from '../components/Auth/Signout';

const Header = ({ classes }) => {
  const { state } = useContext(Store);
  const { currentUser } = state;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.grow}>
            <Terrain className={classes.icon} />
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
            >
              Susreti
            </Typography>
          </div>
          {
            currentUser && (
              <div className={classes.right}>
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                >
                  {currentUser.name}
                </Typography>
                <img src={currentUser.picture} className={classes.picture} alt={currentUser.name} />
                <Signout />
              </div>
            )
          }
        </Toolbar>
      </AppBar>
    </div>
  )
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    display: "flex",
    alignItems: "center"
  },
  right: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: theme.spacing.unit,
    color: "var(--main)",
    fontSize: 45
  },
  mobile: {
    display: "none"
  },
  picture: {
    height: "50px",
    borderRadius: "90%",
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Header);
