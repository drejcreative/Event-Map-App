export const CREATE_PIN_MUTATION = `
  mutation(
    $title: String!,
    $image: String!,
    $content: String!,
    $latitude: Float!,
    $longitude: Float!,
    $eventDate: String!,
    $link: String,
    $_id: ID,
    ) {
      createPin(input: {
        title: $title,
        image: $image,
        content: $content,
        latitude: $latitude,
        longitude: $longitude,
        eventDate: $eventDate
        link: $link
        _id: $_id
      }) {
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

export const DELETE_PIN_MUTATION = `
  mutation($pinId: ID!) {
    deletePin(pinId: $pinId) {
      _id
    }
  }
`

export const CREATE_COMMENT_MUTATION = `
  mutation($pinId: ID!, $text: String!) {
    createComment(pinId: $pinId, text: $text ) {
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

export const DELETE_COMMENT_MUTATION = `
  mutation($pinId: ID!, $commentId: String!) {
    deleteComment(pinId: $pinId, commentId: $commentId ) {
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