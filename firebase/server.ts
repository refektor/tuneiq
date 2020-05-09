import {getFirebaseApp} from "./firebase";

const firestore = getFirebaseApp().firestore();
const MAX_PLAYERS_PER_GAME = 4
/**
 * Parameters used for game creation
 */
type GameConfig = {
    genre?: string; 
    artist?: string;
};


function createGame(gameName: string, gamePassword: string, gameConfig: GameConfig): Promise<string>  {
    /*
    return new Promise(function(resolve, reject) {
        reject("HII");
    });
    */
   return "game_id";
}

function joinGame(gameId: string, playerId: string, playerName: string): Promise<string> {
    return new Promise(function(resolve, reject) {
        firestore.collection("games")
        .doc(gameId)
        .get()
        .then(game => {
            const gameData = game.data();
            const leaderBoard = gameData.leaderBoard;
            if (Object.keys(leaderBoard).length < MAX_PLAYERS_PER_GAME){
                leaderBoard[playerId] = {"name": playerName, "score": 0}
                firestore.collection("games")
                .doc(gameId)
                .update({ 'leaderBoard' : leaderBoard })
                .then(function() {
                    console.log(`Player ${playerId} has joined the game!`);
                    resolve(`Joined game ${gameId}!`)
                })
                .catch(function(error) {
                    console.error(`Error joining game: ${error}`);
                    reject(`Error joining game: ${error}`)
                });
            } else {
                reject(`Game ${gameId} is full`);
            }
        })
        .catch(error => {
            console.log(error);
            reject(`Could not find game with ID ${gameId}`);
        })
    });
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
    createGame,
    joinGame,
    startGame,
    leaveGame,
    increasePlayerScore,
};