const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const {
    verifyToken
} = require('./utils/jwtHelper');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for testing
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Tic-Tac-Toe API',
            version: '1.0.0',
            description: 'APIs for a turn-based Tic-Tac-Toe game',
        },
        servers: [{ url: 'http://localhost:5000' }],
    },
    apis: ['./routes/*.js'], // Points to API docs in route files
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', verifyToken, gameRoutes);

// WebSocket Logic
io.on('connection', require('./controllers/socketController'));

// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));