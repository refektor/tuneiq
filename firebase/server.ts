import { getFirebaseApp } from './firebase'
import { generateGameContent, GameDetails } from './game_content'
import { firestore } from 'firebase'

const MAX_PLAYERS_PER_GAME = 4

function createGame(gameName: string, gamePassword: string, gameGenre: string, hostName: string, hostId: string) {
    return getFirebaseApp().firestore().collection("games").where("name", "==", gameName).get().then(games => {
        console.log(games.empty)
        if (games.empty) {
            const gameContent = generateGameContent(gameGenre, hostId, hostName, gameName, gamePassword)
            return gameContent.then((details: GameDetails) => {
                console.log(details)
                return getFirebaseApp().firestore().collection("games")
                    .add(details)
                    .then((docRef) => {
                        console.log(docRef)
                        console.log("succesfully created game with id: ", docRef.id);
                        return docRef.id
                    })
                    .catch((error) => {
                        console.log(error);
                        return error
                    });
            })
        } else {
            console.log("bbob")
            return Promise.reject("Game name already exists")
        }
    }).catch(error => {
        return error
    })
}


function joinGame(gameId: string, playerId: string, playerName: string) {
    return getFirebaseApp().firestore().collection("games").doc(gameId).get().then((game) => {
        if (!game.exists){
            return Promise.reject(`Cannot find game with id ${gameId}.`)
        }
        const gameData = game.data();
        const leaderBoard = gameData.leaderBoard;
        if (Object.keys(leaderBoard).length >= MAX_PLAYERS_PER_GAME){
            return Promise.reject(`Game ${gameId} is full`);
        }
        else if(playerId in leaderBoard){
            return Promise.reject(`Player ${playerId} has already joined game ${gameId}.`);
        }
        else{
            leaderBoard[playerId] = {"name": playerName, "score": 0}
            getFirebaseApp().firestore().collection("games")
            .doc(gameId)
            .update({ 'leaderBoard' : leaderBoard });
            return gameId;
        }
        }).catch((error) => {
            return error;
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