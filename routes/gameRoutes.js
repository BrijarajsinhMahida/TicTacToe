const express = require('express');
const {
    createGameRoom,
    joinGameRoom,
    listActiveRooms,
    leaderboard,
    joinSpectator
} = require('../controllers/gameController');
const router = express.Router();

/**
 * @swagger
 * /api/games/rooms:
 *   post:
 *     summary: Create a game room
 *     tags: [Games]
 */
router.post('/rooms', createGameRoom);

/**
 * @swagger
 * /api/games/rooms/join:
 *   post:
 *     summary: Join a game room
 *     tags: [Games]
 */
router.post('/rooms/join', joinGameRoom);

/**
 * @swagger
 * /api/games/rooms:
 *   get:
 *     summary: List all active public rooms
 *     tags: [Games]
 */
router.get('/rooms', listActiveRooms);

/**
 * @swagger
 * /api/games/leaderboard:
 *   get:
 *     summary: Get the top players leaderboard
 *     tags: [Games]
 */
router.get('/leaderboard', leaderboard);

/**
 * @swagger
 * /api/games/joinSpectator:
 *   post:
 *     summary: Join a game room as a spectator
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 description: The ID of the game room
 *     responses:
 *       200:
 *         description: Spectator joined successfully
 *       404:
 *         description: Game room not found
 */
router.post('/joinspectator', joinSpectator);

module.exports = router;