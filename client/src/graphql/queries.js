export const ME_QUERY = `
{
  me {
    _id
    name
    email
    picture
    admin
  }
}
`

export const GET_PINS_QUERY = `
{
  getPins {
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