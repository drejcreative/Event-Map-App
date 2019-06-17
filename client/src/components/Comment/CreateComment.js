import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";

import { CREATE_COMMENT_MUTATION } from '../../graphql/mutations';
import { useClient } from '../../client';
import Store from '../../store/store';

import './Comments.scss';

const CreateComment = ({ classes }) => {
  const client = useClient();
  const { state } = useContext(Store);
  const [comment, setComment] = useState('');

  const handleSubmitComment = async () => {
    const prepareData = { pinId: state.currentPin._id, text: comment }
    await client.request(CREATE_COMMENT_MUTATION, prepareData);

    // const { createComment } = await client.request(CREATE_COMMENT_MUTATION, prepareData);
    // dispatch({ type: CREATE_COMMENT, payload: createComment });
    setComment('');
  }

  return (
    <div className="comment-create">
      <form className={classes.form}>
        <IconButton
          className={classes.clearButton}
          color="secondary"
          disabled={!comment.trim()}
          onClick={() => setComment('')}
        >
          <ClearIcon />
        </IconButton>
        <InputBase
          multiline
          className={classes.input}
          placeholder="Dodaj komentar"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <IconButton
          onClick={handleSubmitComment}
          className={classes.clearButton}
          disabled={!comment.trim()}
          color="secondary"
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </div>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
