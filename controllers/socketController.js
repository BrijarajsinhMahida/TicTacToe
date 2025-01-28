const GameRoom = require('../models/gameRoomModel');
const { checkWinner } = require('../utils/checkWinner');

module.exports = (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a specific game room
    socket.on('startGame', async ({ roomId }) => {
        try {
            // Find room from db by roomId
            const gameRoom = await GameRoom.findById(roomId);
            // If room not found then emit event of socket to room not found
            if (!gameRoom) {
                return socket.emit('error', { message: 'Room not found' });
            }
            // If room's players are 2 then emit event of socket to start game
            if (gameRoom.players.length === 2) {
                socket.to(roomId).emit('gameStart', { players: gameRoom.players });
            }
        } catch (error) {
            console.error(error);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    // Handle player moves
    socket.on('playerMove', async ({ roomId, playerId, row, col }) => {
        try {
            // Find room from db by roomId
            const gameRoom = await GameRoom.findById(roomId);
            // If room not found then emit event of socket to room not found
            if (!gameRoom) {
                return socket.emit('error', { message: 'Room not found' });
            }
            // If wrong user performs move
            if (gameRoom.turn.toString() !== playerId) {
                // Prevent move
                return socket.emit('error', { message: 'Not your turn' });
            }
            // If user performs move on the invalid position
            if (gameRoom.boardState[row][col] !== '') {
                return socket.emit('error', { message: 'Invalid move' });
            }
            // Define symbol based on the player if creator user then symbol will be X otherwise symbol will be O
            const playerSymbol = gameRoom.players[0].toString() === playerId ? 'X' : 'O';
            // Add the symbol to the board
            gameRoom.boardState[row][col] = playerSymbol;
            // Change the turn of user
            gameRoom.turn = gameRoom.players.find((p) => p.toString() !== playerId);
            // Check winner for the gameroom's board
            const winner = checkWinner(gameRoom.boardState);
            // If winner found
            if (winner) {
                // Then update status as completed
                gameRoom.status = 'completed';
                await gameRoom.save();
                // Emit socket for game End
                socket.to(roomId).emit('gameEnd', { winner });
                return;
            }

            await gameRoom.save();
            // Emit event to player moved
            socket.to(roomId).emit('playerMoved', { playerId, row, col, boardState: gameRoom.boardState });
        } catch (error) {
            console.error(error);
            socket.emit('error', { message: 'Failed to process move' });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
};