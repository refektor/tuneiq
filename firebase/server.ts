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
    return "game_id";
}


function joinGame(gameId: string, playerId: string, playerName: string) {
    return new Promise(function(resolve, reject) {
        firestore.collection("games")
        .doc(gameId)
        .get()
        .then((game) => {
            const gameData = game.data();
            const leaderBoard = gameData.leaderBoard;
            if (Object.keys(leaderBoard).length >= MAX_PLAYERS_PER_GAME){
                reject(`Game ${gameId} is full`);
            }
            else if(playerId in leaderBoard){
                reject(`Player ${playerId} has already joined game ${gameId}.`);
            }
            else{
                leaderBoard[playerId] = {"name": playerName, "score": 0}
                firestore.collection("games")
                .doc(gameId)
                .update({ 'leaderBoard' : leaderBoard })
                .then(result => {
                    resolve(`Player ${playerId} has joined  game ${gameId}!`)
                    console.log(result)
                })
                .catch(error => {
                    reject(`Error joining game: ${error}`)
                });
            }
        }).catch(error => {
            reject(`Could not find game with ID ${gameId}`);
        });
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