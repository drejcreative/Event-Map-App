import React, { useContext, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import format from 'date-fns/format';

import AccessTime from "@material-ui/icons/AccessTime";
import Face from "@material-ui/icons/Face";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import EditIcon from "@material-ui/icons/Edit";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import CancelIcon from "@material-ui/icons/Cancel";

import Store from '../../store/store';
import config from '../../config';
import { useClient } from '../../client';

import CreateComment from '../Comment/CreateComment';
import Comments from '../Comment/Comments';

import { CLEAR_CURRENT_PIN, CREATE_DRAFT, CREATE_DRAFT_EDIT, REMOVE_POPUP } from '../../store/action-types';
import { DELETE_PIN_MUTATION } from '../../graphql/mutations';

import './PinContent.scss';

const PinContent = ({ classes }) => {
  const { state, dispatch } = useContext(Store);
  const client = useClient();
  const {
    _id,
    title,
    content,
    image,
    latitude,
    longitude,
    eventDate,
    author,
    link,
    comments
  } = state.currentPin;

  const isAuthUser = comment => {
    return state.currentUser._id === author._id || state.currentUser._id === config.ADMIN_ID
  };

  const closeEvent = () => {
    dispatch({ type: CLEAR_CURRENT_PIN });
    dispatch({ type: REMOVE_POPUP })
  }

  const handleDeletePin = async () => {
    const pinToDelete = { pinId: _id };
    await client.request(DELETE_PIN_MUTATION, pinToDelete)
    // const { deletePin } = await client.request(DELETE_PIN_MUTATION, pinToDelete)
    // dispatch({ type: DELETE_PIN, payload: deletePin })
    dispatch({ type: REMOVE_POPUP })
  }

  return (
    <div className="event">
      <img className="event__image" src={image} alt={title} />
      {
        isAuthUser() && (
          <div className="event__options">
            <EditIcon onClick={() => dispatch({ type: CREATE_DRAFT_EDIT })} />
            <CancelIcon onClick={closeEvent} />
            <DeleteIcon onClick={handleDeletePin} />
          </div>
        )
      }
      <div className="event__content">
        <h2>{title}</h2>
        <p className="popup-label"><Face /> Author</p>
        <p className="event__section">{author.name}</p>
        <p className="popup-label"><AccessTime /> Date</p>
        <p className="event__section">{format(new Date(eventDate * 1), 'MM/DD/YYYY/hh:m')}</p>
        <p className="popup-label">Coordinates</p>
        <p className="event__section coordinates">{latitude} - {longitude}</p>
        {
          link && (
            <p className="event__section"><a target="_blank" rel="noopener noreferrer" href={link}>Link ka Dogadjaju</a></p>
          )
        }
        <p dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
      </div>
      { /* Comments */}
      <div className="commnents">
        <CreateComment />
        <Comments comments={comments} />
      </div>
    </div>
  );
};

const styles = theme => ({
  root: {
    padding: "1em 0.5em",
    textAlign: "center",
    width: "100%"
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default withStyles(styles)(PinContent);
