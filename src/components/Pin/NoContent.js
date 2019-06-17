import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ExploreIcon from "@material-ui/icons/Explore";
import Typography from "@material-ui/core/Typography";

const NoContent = ({ classes }) => {
  return (
    <div className={classes.root}>
      <ExploreIcon className={classes.icon} />
      <Typography
        noWrap
        component="h2"
        variant="h6"
        gutterBottom
      >
        Click on Map to ad a Pin
    </Typography>
    </div>
  )
};

const styles = theme => ({
  root: {
    display: "flex",
    marginTop: '150px',
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: "80px",
    color: "var(--main)"
  }
});

export default withStyles(styles)(NoContent);
