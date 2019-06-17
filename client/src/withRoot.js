import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import lime from "@material-ui/core/colors/lime";
import grey from "@material-ui/core/colors/grey";
import CssBaseline from "@material-ui/core/CssBaseline";

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: lime,
    primary: {
      light: grey[900],
      main: grey[900],
      dark: grey[900]
    }
  },
});

function withRoot(Component) {
  function WithRoot(props) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
