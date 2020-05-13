import { AxiosRequestConfig } from 'axios';
import axios from 'axios'
import { getFirebaseApp } from './firebase'
import { availableGenres } from './available_genres'

const MAX_PLAYERS_PER_GAME = 4

function createGame(gameName: string, gamePassword: string, gameGenre: string, hostName: string, hostId: string) {
    return doesGameNameExist(gameName).then((_) => {
        console.log('game name does not exist, creating new game')
        const ganerateGameContentEndPoint = "https://us-central1-tuneiq.cloudfunctions.net/generateGameContent"
        const generateGameContentConfig: AxiosRequestConfig = {
            url: ganerateGameContentEndPoint,
            method: 'post',
            params:
            {
                genre: gameGenre,
                hostId: hostId,
                hostName: hostName,
                password: gamePassword,
                name: gameName
            }
        };

        return axios.request(generateGameContentConfig).then(gameDetails => {
            console.log(gameDetails.data)
            return getFirebaseApp().firestore().collection("games")
                .add(gameDetails.data)
                .then((docRef) => {
                    console.log(docRef)
                    console.log("succesfully created game with id: ", docRef.id);
                    return docRef.id
                })
                .catch((error) => {
                    console.log(error);
                    return Promise.reject(error)
                });
        }).catch(error => {
            return Promise.reject(error)
        })
    });
}

function doesGameNameExist(name) {
    return getFirebaseApp().firestore().collection("games")
        .where("name", "==", name)
        .get()
        .then(games => {
            if (!games.empty) {
                return Promise.reject(`Game name: ${name}, already exists`)
            }

            return Promise.resolve(games);
        })
        .catch(error => {
            console.log(error);
            return Promise.reject(error);
        });
}

function getPossibleGenres() {
    // TODO: replace with call to spotify api, endpoint: https://api.spotify.com/v1/recommendations/available-genre-seeds
    return availableGenres['genres']
        .filter((genre) => { return genre === "house" || genre === "dance" || genre === "hip-hop" || genre === "latin" || genre === "reggae" || genre === "techno" })
        .map((genre) => {
            return {
                genre: genre,
                img: `../${genre}.jpg`
            }
        });
}

function attemptToJoinGame(gameName: string, gamePassword: string, playerId: string, playerName: string) {
    return getFirebaseApp().firestore().collection("games")
        .where("name", "==", gameName)
        .get().then((games) => {
            console.log(games)
            const gameId = games.docs[0].id;
            console.log(games.docs[0].data());
            if (gamePassword === games.docs[0].data().password) {
                return joinGame(gameId, playerId, playerName);
            } else {
                return Promise.reject({ field: "password", message: "Invalid password." });
            }

        }).catch((err) => (Promise.reject({ field: "gameName", message: "Game does not exist." })));
}


function joinGame(gameId: string, playerId: string, playerName: string) {
    return getFirebaseApp().firestore().collection("games").doc(gameId).get().then((game) => {
        if (!game.exists) {
            return Promise.reject(`Cannot find game with id ${gameId}.`)
        }
        const gameData = game.data();
        const leaderBoard = gameData.leaderBoard;
        if (Object.keys(leaderBoard).length >= MAX_PLAYERS_PER_GAME) {
            return Promise.reject(`Game ${gameId} is full`);
        }
        else if (playerId in leaderBoard) {
            return Promise.reject(`Player ${playerId} has already joined game ${gameId}.`);
        }
        else {
            leaderBoard[playerId] = { "name": playerName, "score": 0 }
            getFirebaseApp().firestore().collection("games")
                .doc(gameId)
                .update({ 'leaderBoard': leaderBoard });
            return gameId;
        }
    }).catch((error) => {
        return error;
    });
}

function startGame(gameId: string): void {
    const startTime = new Date().getTime() + 5000; // 5 seconds
    getFirebaseApp().firestore().collection("games")
        .doc(gameId)
        .update({ startTime })
    return;
}

function deleteGame(gameId: string): Promise<string> {
    const gameDocRef = getFirebaseApp().firestore().collection("games").doc(gameId);
    return getFirebaseApp().firestore().runTransaction((transaction) => {
        return transaction.get(gameDocRef).then(gameDoc => {
            if (!gameDoc.exists) {
                return Promise.reject(`Game Id: ${gameId} is invalid.`)
            }
            transaction.delete(gameDocRef);
            return `Game ${gameId} was deleted.`
        })
    }).then((response) => {
        return response;
    }).catch((error) => {
        return error;
    })
}

/*
* TODO: Decide on and implement more end game logic. For now, simply delete the game.
*/
function endGame(gameId: string): Promise<string> {
    return deleteGame(gameId);
}

function leaveGame(gameId: string, userId: string): void {
    return;
}

// Returns the updated score
function increasePlayerScore(gameId: string, userId: string, pctRoundRemaining: number): Promise<number> {
    const gameDocRef = getFirebaseApp().firestore().collection("games").doc(gameId);
    return getFirebaseApp().firestore().runTransaction((transaction) => {
        return transaction.get(gameDocRef).then(gameDoc => {
            if (!gameDoc.exists) {
                return Promise.reject(`Game Id: ${gameId} is invalid`)
            }

            if (!gameDoc.data().leaderBoard.hasOwnProperty(userId)) {
                return Promise.reject(`User Id: ${userId} is invalid`)
            }
            const newScore = Math.ceil((100 * pctRoundRemaining) + gameDoc.data().leaderBoard[userId].score);
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
    doesGameNameExist,
    getPossibleGenres,
    createGame,
    attemptToJoinGame,
    joinGame,
    startGame,
    deleteGame,
    endGame,
    leaveGame,
    increasePlayerScore,
};