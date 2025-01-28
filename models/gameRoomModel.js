const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPrivate: { type: Boolean, default: false },
    joinCode: { type: String },
    spectators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    boardState: { type: [[String]], default: [['', '', ''], ['', '', ''], ['', '', '']] },
    turn: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'waiting', enum: ['waiting', 'active', 'completed'] },
    joinBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('GameRoom', gameRoomSchema);
