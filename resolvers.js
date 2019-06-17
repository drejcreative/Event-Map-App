const { AuthenticationError, PubSub } = require('apollo-server');

const Pin = require('./models/Pin');

const pubsub = new PubSub();

const PIN_ADDED = "PIN_ADDED";
const PIN_DELETED = "PIN_DELETED";
const PIN_UPDATED = "PIN_UPDATED";
const COMMENT_DELETED = "COMMENT_DELETED";
const PIN_EDITED = "PIN_EDITED";

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be loged in')
  }
  return next(root, args, ctx, info);
}

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({}).populate('author').populate('comments.author');
      return pins;
    }
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      if (args.input._id) {
        const updatePin = await Pin.findByIdAndUpdate(args.input._id, args.input, { new: true });
        const updatedPin = await Pin.populate(updatePin, 'author');

        pubsub.publish(PIN_EDITED, { pinEditedSubscribe: updatedPin });
        return updatedPin;
      }

      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id
      }).save();
      const pinAdded = await Pin.populate(newPin, 'author');

      pubsub.publish(PIN_ADDED, { pinAddedSubscribe: pinAdded });
      return pinAdded;
    }),
    deletePin: authenticated(async (root, args, ctx) => {
      const deletedPin = await Pin.findOneAndDelete({ _id: args.pinId }).exec();

      pubsub.publish(PIN_DELETED, { pinDeletedSubscribe: deletedPin });
      return deletedPin;
    }),
    createComment: authenticated(async (root, args, ctx) => {
      const newComment = { text: args.text, author: ctx.currentUser._id };
      const commentAdded = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        {
          $push: {
            comments: newComment
          }
        },
        {
          new: true
        }
      ).populate('author').populate('comments.author');

      pubsub.publish(PIN_UPDATED, { pinUpdatedSubscribe: commentAdded });
      return commentAdded;
    }),
    deleteComment: authenticated(async (root, args, ctx) => {
      const commentDeleted = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        {
          $pull: {
            comments: {
              _id: args.commentId
            }
          }
        },
        {
          new: true
        }
      ).populate('comments.author');

      pubsub.publish(COMMENT_DELETED, { deleteCommentSubscribe: commentDeleted });
      return commentDeleted;
    }),
  },
  Subscription: {
    pinAddedSubscribe: {
      subscribe: () => pubsub.asyncIterator(PIN_ADDED)
    },
    pinEditedSubscribe: {
      subscribe: () => pubsub.asyncIterator(PIN_EDITED)
    },
    pinUpdatedSubscribe: {
      subscribe: () => pubsub.asyncIterator(PIN_UPDATED)
    },
    pinDeletedSubscribe: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED)
    },
    deleteCommentSubscribe: {
      subscribe: () => pubsub.asyncIterator(COMMENT_DELETED)
    }
  },
}