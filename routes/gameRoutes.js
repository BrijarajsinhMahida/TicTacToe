const express = require('express');
const {
    createGameRoom,
    joinGameRoom,
    listActiveRooms,
    leaderboard,
    joinSpectator
} = require('../controllers/gameController');
const router = express.Router();

// GET API to list active rooms
router.get('/rooms', listActiveRooms);

// GET API to show leaderboard
router.get('/leaderboard', leaderboard);

// POST API to create room 
router.post('/rooms', createGameRoom);

// POST API to join room
router.post('/rooms/join', joinGameRoom);

// POST API to join game as spectator
router.post('/joinspectator', joinSpectator);

module.exports = router;