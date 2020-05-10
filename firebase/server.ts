import { getFirebaseApp } from './firebase'
import { generateGameContent, GameDetails } from './game_content'


function createGame(gameName: string, gamePassword: string, gameGenre: string, hostName: string, hostId: string): Promise<string> {
    return getFirebaseApp().firestore()
        .collection("games")
        .where("name", "==", gameName)
        .get().then(games => {
            if (games.empty) {
                return generateGameContent(gameGenre, hostId, hostName, gameName, gamePassword)
                    .then((details: GameDetails) => {
                        return getFirebaseApp().firestore()
                            .collection("games")
                            .add(details)
                            .then((docRef) => {
                                console.log("succesfully created game with id: ", docRef.id);
                                return docRef.id
                            })
                            .catch((error) => {
                                return error
                            });
                    }).catch(error => {
                        return error
                    })
            } else {
                return Promise.reject("Game name already exists")
            }
        }).catch(error => {
            return error
        })
}

function joinGame(gameName: string, gamePassword: string) {
    return "gameId";
}

function startGame(gameId: string): void {
    return;
}

function leaveGame(gameId: string, userId: string): void {
    return;
}

// Returns the updated score
function increasePlayerScore(gameId: string, userId: string, percentRoundComplete: number): Promise<number> {
    const gameDocRef = getFirebaseApp().firestore().collection("games").doc(gameId)
    return getFirebaseApp().firestore().runTransaction((transaction) => {
        return transaction.get(gameDocRef).then(gameDoc => {
            if (!gameDoc.exists) {
                return Promise.reject(`Game Id: ${gameId} is invalid`)
            }

            if (!gameDoc.data().leaderBoard.hasOwnProperty(userId)) {
                return Promise.reject(`User Id: ${userId} is invalid`)
            }
            const newScore = (100 * percentRoundComplete) + gameDoc.data().leaderBoard[userId].score;
            transaction.update(gameDocRef, {
                [`leaderBoard.${userId}.score`]: newScore
            });
            return newScore
        })
    }).then(response => {
        return response
    }).catch(error => {
        return error
    })
}

export {
    createGame,
    joinGame,
    startGame,
    leaveGame,
    increasePlayerScore,
};