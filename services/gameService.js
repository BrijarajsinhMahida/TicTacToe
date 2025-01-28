const GameRoom = require('../models/gameRoomModel');
const userModel = require('../models/userModel');

// Creates a room with the room details
const createRoom = async ({ roomName, createdBy, isPrivate }) => {
    // If room created with private then generate join code
    const joinCode = isPrivate ? Math.random().toString(36) : null;
    // Create game room
    const room = new GameRoom({ roomName, createdBy, isPrivate, joinCode, players: [createdBy] });
    return room.save();
};

// Requested user can Join room based on roomID
const joinRoom = async ({ roomId, joinCode, userId }) => {
    // Find room by roomId 
    const room = await GameRoom.findById(roomId);
    // If room not found then send an error
    if (!room) throw new Error('Room not found');
    // If requested room is private and join code is not valid then send an error
    if (room.isPrivate && room.joinCode !== joinCode) throw new Error('Invalid join code');
    // If joined user requests to join again into the same room then send an error
    if (room.createdBy == userId || room.joinBy == userId) throw new Error('You are already in the room');
    // If room has joined players then send an error
    if (room.joinBy) throw new Error('Room is full');
    // Set the joinBy field with the requested user and mark it as current player
    await GameRoom.findByIdAndUpdate(roomId, {
        $set: {
            joinBy: userId,
            currentPlayer: userId
        },
        $push: {
            players: userId
        }
    });
    return room;
};

// Used to fetch active rooms from DB
const fetchActiveRooms = async () => {
    return GameRoom.find({ isPrivate: false, joinBy: null });
};

// Used to fetch user which has most win from DB
const getLeaderboard = async () => {
    return userModel.find({}, { username: 1, wins: 1, _id: 0 }).sort({ wins: -1 }).limit(10);
};

module.exports = { createRoom, joinRoom, fetchActiveRooms, getLeaderboard };