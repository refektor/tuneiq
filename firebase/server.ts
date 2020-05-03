
/**
 * Parameters used for game creation
 */
type GameConfig = {
    genre?: string, 
    artist?: string,
};

function createGame(gameName: string, gamePassword: string, gameConfig: GameConfig): string  {
    return "gameId";
}

function joinGame(gameName: string, gamePassword: string): string {
    return "gameId";
}

function startGame(gameId: string): void {
    return;
}

function leaveGame(gameId: string, userId: string): void {
    return;
}

function increasePlayerScore(gameId: string, userId: string, timeSinceRoundStart: number): void {
    return;
}

export {
    createGame
};