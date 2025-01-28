exports.checkWinner = (boardState) => {
    // Check rows and columns
    for (let i = 0; i < 3; i++) {
        if (boardState[i][0] && boardState[i][0] === boardState[i][1] && boardState[i][1] === boardState[i][2])
            return boardState[i][0];
        if (boardState[0][i] && boardState[0][i] === boardState[1][i] && boardState[1][i] === boardState[2][i])
            return boardState[0][i];
    }

    // Check diagonals
    if (boardState[0][0] && boardState[0][0] === boardState[1][1] && boardState[1][1] === boardState[2][2])
        return boardState[0][0];
    if (boardState[0][2] && boardState[0][2] === boardState[1][1] && boardState[1][1] === boardState[2][0])
        return boardState[0][2];

    // Check for draw
    if (boardState.every(row => row.every(cell => cell))) return 'draw';

    return null;
};
