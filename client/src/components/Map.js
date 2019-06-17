import React, { useState, useEffect, useContext } from "react";
import ReactMapGl, { NavigationControl, Marker, Popup } from 'react-map-gl';
import { withStyles } from "@material-ui/core/styles";
import format from 'date-fns/format';
import { Subscription } from 'react-apollo';

import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import NotListedLocationIcon from "@material-ui/icons/NotListedLocation";
import PlaceIcon from "@material-ui/icons/Place";
import HomeIcon from "@material-ui/icons/Home";
import CancelIcon from "@material-ui/icons/Cancel";

import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries';

import Store from '../store/store';
import { DELETE_PIN_MUTATION } from '../graphql/mutations';
import {
  CREATE_DRAFT,
  UPDATE_DRAFT,
  GET_PINS,
  SET_PIN,
  UPDATE_PIN,
  DELETE_PIN,
  CLEAR_CURRENT_PIN,
  CREATE_PIN,
  CREATE_COMMENT,
  DELETE_COMMENT,
  SET_POPUP,
  REMOVE_POPUP
} from '../store/action-types';

import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_EDITED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
  COMMENT_DELETED_SUBSCRIPTION
} from '../graphql/subscriptions';

import Blog from './Blog';

import config from '../config';

const INITIAL_VIEWPORT = {
  latitude: 45.005210,
  longitude: 19.816196,
  zoom: 7
}


const Map = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Store);
  const { popup } = state;

  useEffect(() => {
    getPins()
  }, []);

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
  const [userPosition, setUserPosition] = useState(null);
  const { mapTheme } = state;

  useEffect(() => {
    getUserPosition()
  }, []);

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: GET_PINS, payload: getPins });
  }

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      })
    }
  }

  const highlightPinColor = pin => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((new Date(pin.eventDate * 1).getTime() - new Date().getTime()) / (oneDay)));
    if (new Date(pin.eventDate * 1) < new Date()) {
      return '--light'
    }
    return diffDays <= 7 ? 'var(--main)' : 'var(--focus)';
  }

  const handleSelectedPin = pin => {
    dispatch({ type: SET_POPUP, payload: pin })
    dispatch({ type: SET_PIN, payload: pin })
  }

  const handleDeletePin = async pin => {
    const pinToDelete = { pinId: pin._id };
    await client.request(DELETE_PIN_MUTATION, pinToDelete)
    // const { deletePin } = await client.request(DELETE_PIN_MUTATION, pinToDelete)
    // dispatch({ type: DELETE_PIN, payload: deletePin })
    dispatch({ type: REMOVE_POPUP })
  }

  const isAuthUser = () => {
    return state.currentUser._id === popup.author._id || state.currentUser._id === config.ADMIN_ID
  };

  const closePopup = () => {
    dispatch({ type: REMOVE_POPUP })
    dispatch({ type: CLEAR_CURRENT_PIN });
  }

  const onDraftMarkerDragEnd = event => {
    dispatch({
      type: UPDATE_DRAFT,
      payload: {
        longitude: event.lngLat[0],
        latitude: event.lngLat[1]
      }
    })
  };

  const userMarker = () => (
    <Marker
      latitude={userPosition.latitude}
      longitude={userPosition.longitude}
      offsetLeft={-19}
      offsetTop={-37}
    >
      <HomeIcon style={{
        fontSize: 40,
        color: `var(--white)`
      }} />
    </Marker>
  )

  const draftMarker = () => (
    <Marker
      latitude={state.draft.latitude}
      longitude={state.draft.longitude}
      offsetLeft={-19}
      offsetTop={-37}
      draggable
      onDragEnd={onDraftMarkerDragEnd}
    >
      <NotListedLocationIcon style={{
        fontSize: 40,
        color: `var(--focus)`
      }}
      />
    </Marker>
  )

  const eventMarker = pin => {
    const color = highlightPinColor(pin);
    return (
      <Marker
        key={pin._id}
        latitude={pin.latitude}
        longitude={pin.longitude}
        offsetLeft={-19}
        offsetTop={-37}
      >
        <PlaceIcon
          onClick={() => handleSelectedPin(pin)}
          style={{
            fontSize: 40,
            color
          }}
        />
      </Marker>
    )
  }

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({
        type: CREATE_DRAFT
      })
    }

    const [longitude, latitude] = lngLat;
    dispatch({
      type: UPDATE_DRAFT,
      payload: { longitude, latitude }
    })
  }

  return (
    <div className={classes.root}>
      <ReactMapGl
        mapboxApiAccessToken={config.MAP_TOKEN}
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle={`mapbox://styles/mapbox/${mapTheme}`}
        onViewportChange={viewport => setViewport(viewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl onViewportChange={viewport => setViewport(viewport)} />
        </div>
        {
          userPosition && userMarker()
        }
        {
          state.draft && draftMarker()
        }

        {/* Render Pins */}
        {
          state.pins && state.pins.map(pin => (
            eventMarker(pin)
          ))
        }

        {/* Popup */}
        {
          popup && (
            <Popup
              anchor="top"
              latitude={popup.latitude}
              longitude={popup.longitude}
              closeOnClick={false}
              onClose={() => dispatch({ type: REMOVE_POPUP })}
            >
              <img className={classes.popupImage} src={popup.image} alt={popup.title} />
              <div className="popup-style">
                <h4>{popup.title}</h4>
                <p className="popup-label">Date</p>
                <p>{format(new Date(popup.eventDate * 1), 'MM/DD/YYYY/hh:m')}</p>
                <p className="popup-label">Coordinates</p>
                <p>{popup.latitude.toFixed(6)} - {popup.longitude.toFixed(6)}</p>
                <div className="popup-footer">
                  {
                    isAuthUser() && (

                      <Button onClick={() => handleDeletePin(popup)} color="secondary" >
                        <DeleteIcon className={classes.deleteIcon} />
                      </Button>
                    )
                  }
                  <Button
                    component="span"
                    color="primary"
                    size="small"
                  >
                    <CancelIcon className={classes.deleteIcon} onClick={closePopup} />
                  </Button>
                </div>
              </div>
            </Popup>
          )
        }
      </ReactMapGl>

      {/* Subscriptions */}
      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAddedSubscribe } = subscriptionData.data;

          dispatch({ type: CREATE_PIN, payload: pinAddedSubscribe })
        }}
      />
      <Subscription
        subscription={PIN_EDITED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinEditedSubscribe } = subscriptionData.data;
          dispatch({ type: UPDATE_PIN, payload: pinEditedSubscribe });
          dispatch({ type: SET_POPUP, payload: pinEditedSubscribe })
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdatedSubscribe } = subscriptionData.data;

          dispatch({ type: CREATE_COMMENT, payload: pinUpdatedSubscribe });
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeletedSubscribe } = subscriptionData.data;

          dispatch({ type: DELETE_PIN, payload: pinDeletedSubscribe })
        }}
      />

      <Subscription
        subscription={COMMENT_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { deleteCommentSubscribe } = subscriptionData.data;

          dispatch({ type: DELETE_COMMENT, payload: deleteCommentSubscribe })
        }}
      />

      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: '100%',
    maxWidth: '320px',
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
