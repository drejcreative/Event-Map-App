import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import CloseIcon from "@material-ui/icons/Close";

import { DELETE_COMMENT_MUTATION } from '../../graphql/mutations';

import config from '../../config';

import { useClient } from '../../client';

import Store from '../../store/store';

const Comments = ({ classes, comments }) => {
  const { state } = useContext(Store);
  const client = useClient();

  const removeComment = async ({ _id }) => {
    const prepareData = { pinId: state.currentPin._id, commentId: _id }
    await client.request(DELETE_COMMENT_MUTATION, prepareData);
  }

  const isAuthUser = comment => {
    return state.currentUser._id === comment.author._id || state.currentUser._id === config.ADMIN_ID
  };

  return (
    <List>
      {
        comments.map((comment, i) => (
          <div className="display-comment" key={i}>
            <ListItem alignItems="flex-start" >
              <ListItemAvatar>
                <Avatar src={comment.author.picture} alt={comment.author.name} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div className="display-comment__meta">
                    <Typography className={classes.inline} component="span" color="secondary" >
                      {comment.author.name}
                    </Typography>
                    <span className="timestamp">
                      {
                        distanceInWordsToNow(comment.createdAt * 1)
                      } ago
                    </span>
                    {
                      isAuthUser(comment) && <CloseIcon className="display-comment__delete" onClick={() => removeComment(comment)} />
                    }
                  </div>
                }
                secondary={comment.text}
              />
            </ListItem>
          </div>
        ))
      }
    </List>
  )
};

const styles = theme => ({
  root: {
    width: "100%",
  },
  inline: {
    display: "inline"
  }
});

export default withStyles(styles)(Comments);
