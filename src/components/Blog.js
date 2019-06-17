import React, { useContext, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import Radio from '@material-ui/core/Radio';

import Store from '../store/store';
import { SET_THEME } from '../store/action-types';
import NoContent from './Pin/NoContent';
import CreatePin from './Pin/CreatePin';
import PinContent from './Pin/PinContent';

const Blog = ({ classes }) => {
  const { state, dispatch } = useContext(Store);
  const { draft, mapTheme, currentPin } = state;

  let BlogContent;
  if (!draft && !currentPin) {
    BlogContent = NoContent;
  }
  if (draft && !currentPin) {
    BlogContent = CreatePin;
  }

  if (!draft && currentPin) {
    BlogContent = PinContent
  }

  if (draft && currentPin) {
    BlogContent = CreatePin
  }

  useEffect(() => {
    getUserTheme()
  }, []);

  const getUserTheme = () => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      dispatch({ type: SET_THEME, payload: theme });
    }
  }

  const setUserTheme = (theme) => {
    localStorage.setItem("theme", theme);
  }

  const changeTheme = (event) => {
    dispatch({ type: SET_THEME, payload: event.target.value });
    setUserTheme(event.target.value);
  };

  return (
    <Paper className={classes.root}>
      <BlogContent />
      <div className="blog-footer">
        <p>Set Theme for map</p>
        <Radio
          checked={mapTheme === 'streets-v10'}
          onChange={changeTheme}
          value='streets-v10'
          name="radio-button-demo"
          aria-label="A"
        />
        <Radio
          checked={mapTheme === 'outdoors-v10'}
          onChange={changeTheme}
          value='outdoors-v10'
          name="radio-button-demo"
          aria-label="B"
        />
        <Radio
          checked={mapTheme === 'light-v9'}
          onChange={changeTheme}
          value='light-v9'
          name="radio-button-demo"
          aria-label="C"
        />
        <Radio
          checked={mapTheme === 'dark-v9'}
          onChange={changeTheme}
          value='dark-v9'
          name="radio-button-demo"
          aria-label="D"
        />
        <Radio
          checked={mapTheme === 'satellite-v9'}
          onChange={changeTheme}
          value='satellite-v9'
          name="radio-button-demo"
          aria-label="E"
        />
        <Radio
          checked={mapTheme === 'satellite-streets-v10'}
          onChange={changeTheme}
          value='satellite-streets-v10'
          name="radio-button-demo"
          aria-label="F"
        />
      </div>
    </Paper>
  );
};

const styles = {
  root: {
    minWidth: 700,
    maxWidth: 700,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    backgroundColor: '#323232'
  },
  footer: {
    marginTop: 'auto'
  },
  rootMobile: {
    minWidth: "100%",
    maxWidth: "100%",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll"
  }
};

export default withStyles(styles)(Blog);
