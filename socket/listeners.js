const Chats = require('../model/chats');
const Auth = require('../model/auth');
const { cleaning } = require('../utils/cleaning');

/**
 * TODO: Change This Code To Redis So It Can Be Fast
 * `This is the List Of All Active User`
 */
let onlineUsers = [];

/**
 * This Handle the User list and check if the user exist and return the Object
 * @param {String} userID The User Mongoose ID
 * @returns {JSON} This Return a Signle object `{
 *  id:socket.id,
 *  user:userID
 * }`
 */
const check = async (userID) => {
  return onlineUsers.find((data) => data.user === userID);
};

const makeOnline = async (userID) => {
  const auth = await Auth.findOne({ _id: userID });
  if (auth) {
    auth.isOnline = true;
    await auth.save();
  }
};

/**
 * This Handle the User list and check if the user exist and remove the Object
 * @param {String} socketID The Socket ID
 */
const logUserOut = async (socketID, userID) => {
  const auth = await Auth.findOne({ _id: userID });
  if (auth) {
    auth.isOnline = false;
    auth.lastSeen = Date.now();
    await auth.save();
  }
  return (onlineUsers = onlineUsers.filter((data) => data.id !== socketID));
};

/**
 * This Is My Global Socket Function with listeners
 * @param {Function} io The Server Connection Pool
 */
const initializeListeners = async (io) => {
  io.on('connection', (socket) => {
    console.log({ socket: socket.id, auth: socket.handshake.query.auth });
    const userId = socket.handshake.query.auth; // Params Passed during connections
    if (!userId) {
      return socket.disconnect(); // Disconnect a user from the server Because no Auth Was Provided
    }
    makeOnline(userId);
    onlineUsers.push({
      user: userId,
      id: socket.id
    });

    // monitor Changes
    Chats.watch().on('change', async (change) => {
      const data = change.documentKey;
      const chats = await Chats.findOne({ _id: data._id });
      // New Message
      if (change.operationType == 'update') {
        // Based On My Schema
        const user = check(chats._id.toString());
        if (user) {
          if (user.id == socket.id) {
            let chat;
            if (chats.user._id.toString() == user.user.toString()) {
              const clean = cleaning(chats.userB);
              chat = {
                _id: chats._id,
                newChat: chats.newChatA,
                unread: chats.unreadA,
                lastMessage: chats.lastMessage,
                lastUpdate: chats.updatedAt,
                ...clean
              };
            }

            io.to(user.id).emit(`chat`, {
              chat,
              new:
                chat.lastMessage._sender.toString() == userA.user ? false : true
            });
          }
        }
      }
    });

    // Log Out
    socket.on('disconnect', () => {
      console.log('Disconnect Connections', {
        socket: socket.id,
        auth: socket.handshake.query.auth
      });
      logUserOut(socket.id, socket.handshake.query.auth);
    });
  });
};

module.exports = { initializeListeners };
