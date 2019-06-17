import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import format from 'date-fns/format';
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

import Store from '../../store/store';
import { REMOVE_DRAFT } from '../../store/action-types';
import { useClient } from '../../client';

import { CREATE_PIN_MUTATION } from '../../graphql/mutations';

import config from '../../config';

const CreatePin = ({ classes }) => {
  const { state, dispatch } = useContext(Store);

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [link, setLink] = useState('');
  const [positon, setPositon] = useState({
    latitude: '',
    longitude: ''
  });
  const [submiting, setSubmiting] = useState(false);
  const client = useClient();

  const { draft, currentPin } = state;

  useEffect(() => {
    if (currentPin) {
      setTitle(currentPin.title)
      setImage(currentPin.image)
      setContent(currentPin.content)
      setEventDate(currentPin.eventDate)
      setLink(currentPin.link)
      setPositon({
        latitude: currentPin.latitude,
        longitude: currentPin.longitude
      })
    }
  }, []);

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      setSubmiting(true);
      const { latitude, longitude } = draft;
      const url = await handleImageUpload();

      const preparedData = {
        title,
        content,
        image: url,
        latitude,
        longitude,
        eventDate,
        link
      }
      await client.request(CREATE_PIN_MUTATION, preparedData);
      // const { createPin } = await client.request(CREATE_PIN_MUTATION, preparedData);
      // dispatch({ type: CREATE_PIN, payload: createPin })
      // console.log('pin', { createPin });
      handleDiscardDraft();
    } catch (error) {
      setSubmiting(false);
      console.error(error);
    }
  }

  const handleEdit = async e => {
    try {
      e.preventDefault();
      setSubmiting(true);
      const { latitude, longitude } = positon;
      const url = await handleImageUpload();

      const preparedData = {
        title,
        content,
        image: url,
        latitude,
        longitude,
        eventDate,
        link,
        _id: currentPin._id
      }
      await client.request(CREATE_PIN_MUTATION, preparedData);
      handleDiscardDraft();
    } catch (error) {
      setSubmiting(false);
      console.error(error);
    }
  }

  const handleDiscardDraft = () => {
    setTitle('');
    setImage('');
    setContent('');
    setLink('');
    dispatch({ type: REMOVE_DRAFT });
  }

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'airsoft');
    data.append('cloud_name', config.IMG_CLOUD_NAME)
    const res = await axios.post(config.IMG_CLOUD_URL, data);
    return res.data.url
  }

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} />Pin Location
    </Typography>
      <div className={classes.full} >
        <TextField
          name="title"
          label="title"
          value={title}
          className={classes.full80}
          placeholder="Dodaj Title"
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          id="image"
          className={classes.input}
          onChange={e => setImage(e.target.files[0])}
        />
        <label htmlFor="image">
          <Button
            component="span"
            size="small"
            style={{ color: image && '#c6ff00' }}
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
        <div className={classes.contentField}>
          <TextField
            name="content"
            label="Content"
            value={content}
            multiline
            rows="6"
            margin="normal"
            fullWidth
            variant="outlined"
            placeholder="Dodaj Title"
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <div className={classes.marg} >
          <TextField
            id="eventDate"
            value={new Date()}
            value={currentPin ? format(new Date(+eventDate), 'YYYY-MM-DDTHH:mm') : format(new Date(), 'YYYY-MM-DDTHH:mm')}
            label="Vreme Susreta"
            type="datetime-local"
            fullWidth
            className={classes.textField}
            onChange={e => setEventDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className={classes.marg} >
          <TextField
            name="link"
            label="Link"
            value={link}
            fullWidth
            placeholder="Dodaj Link do Dogadjaja"
            onChange={e => setLink(e.target.value)}
          />
        </div>
        <div className={classes.marg} >
          <Button
            component="span"
            color="primary"
            size="small"
            variant="contained"
            className={classes.button}
            onClick={handleDiscardDraft}
          >
            <ClearIcon className={classes.leftIcon} />
            Discard
          </Button>
          {
            currentPin
              ? (
                <Button
                  type="submit"
                  component="span"
                  color="secondary"
                  size="small"
                  variant="contained"
                  className={classes.button}
                  disabled={!title.trim() || !content.trim() || !image || submiting}
                  onClick={handleEdit}
                >
                  Save Changes
                  <SaveIcon className={classes.rightIcon} />

                </Button>
              )
              : (
                <Button
                  type="submit"
                  component="span"
                  color="secondary"
                  size="small"
                  variant="contained"
                  className={classes.button}
                  disabled={!title.trim() || !content.trim() || !image || submiting}
                  onClick={handleSubmit}
                >
                  Submit
                <SaveIcon className={classes.rightIcon} />

                </Button>
              )
          }
        </div>
      </div>
    </form>
  )
};

const styles = theme => ({
  form: {
    display: "flex",
    margin: '20px',
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit,
    marginTop: '20px',
  },
  full: {
    width: '100%',
  },
  full80: {
    width: '85%',
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: '10px'
  },
  input: {
    display: "none"
  },
  marg: {
    marginBottom: '10px'
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  },
  textField: {
    width: '100 %'
  }
});

export default withStyles(styles)(CreatePin);
