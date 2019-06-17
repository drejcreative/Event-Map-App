import gql from 'graphql-tag';

export const PIN_ADDED_SUBSCRIPTION = gql`
  subscription {
    pinAddedSubscribe {
      _id
      createdAt
      title
      content
      image
      latitude
      longitude
      eventDate
      link
      author {
        _id
        name
        email
        picture
      }
      comments {
        _id
        text
        createdAt
        author {
          _id
          name
          email
          picture
        }
      }
    }
  }
`

export const PIN_EDITED_SUBSCRIPTION = gql`
  subscription {
    pinEditedSubscribe {
      _id
      createdAt
      title
      content
      image
      latitude
      longitude
      eventDate
      link
      author {
        _id
        name
        email
        picture
      }
      comments {
        _id
        text
        createdAt
        author {
          _id
          name
          email
          picture
        }
      }
    }
  }
`

export const PIN_UPDATED_SUBSCRIPTION = gql`
  subscription {
    pinUpdatedSubscribe {
      _id
      createdAt
      title
      content
      image
      latitude
      longitude
      eventDate
      link
      author {
        _id
        name
        email
        picture
      }
      comments {
        _id
        text
        createdAt
        author {
          _id
          name
          email
          picture
        }
      }
    }
  }
`

export const PIN_DELETED_SUBSCRIPTION = gql`
  subscription {
    pinDeletedSubscribe {
      _id
    }
  }
`

export const COMMENT_DELETED_SUBSCRIPTION = gql`
  subscription {
    deleteCommentSubscribe {
      _id
      comments {
        _id
        text
        createdAt
        author {
          _id
          name
          email
          picture
        }
      }
    }
  }
`