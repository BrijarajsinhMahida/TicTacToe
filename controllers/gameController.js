const {
    createRoom,
    joinRoom,
    fetchActiveRooms,
    getLeaderboard
} = require('../services/gameService');
const GameRoom = require('../models/gameRoomModel');

// Controller to create game room
const createGameRoom = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const room = await createRoom(req.body);
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to join game room as a player
const joinGameRoom = async (req, res) => {
    try {
        req.body.userId = req.user.id;
        const room = await joinRoom(req.body);
        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to list active rooms
const listActiveRooms = async (req, res) => {
    try {
        const rooms = await fetchActiveRooms();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for leaderboard
const leaderboard = async (req, res) => {
    try {
        const players = await getLeaderboard();
        res.status(200).json(players);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller to join game room as spectator
const joinSpectator = async (req, res) => {
    const { roomId } = req.body;

    try {
        const gameRoom = await GameRoom.findById(roomId);

        if (!gameRoom) {
            return res.status(404).json({ message: 'Game room not found' });
        }
        if (gameRoom.createdBy == req.user.id || gameRoom.joinBy == req.user.id) {
            return res.status(400).json({ message: 'You are already in the room' });
        }

        // Check if spectators array exists; if not, initialize it
        if (!gameRoom.spectators) {
            gameRoom.spectators = [];
        }

        if (gameRoom.spectators.includes(req.user.id)) {
            return res.status(400).json({ message: 'You are already a spectator' });
        }
        // Add spectator to the room
        gameRoom.spectators.push(req.user.id); // Assuming the user ID is obtained from middleware
        await gameRoom.save();

        return res.status(200).json({ message: 'Spectator joined successfully' });
    } catch (error) {
        console.error('Error joining as spectator:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
};

module.exports = { createGameRoom, joinGameRoom, listActiveRooms, leaderboard, joinSpectator };  