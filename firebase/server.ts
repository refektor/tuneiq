import { AxiosRequestConfig } from 'axios';
import axios from 'axios'
import Hashes from 'jshashes'
import base32 from 'hi-base32'
import { getFirebaseApp } from './firebase'
import { availableGenres } from './available_genres'

const MAX_PLAYERS_PER_GAME = 4;
const GAME_CODE_LENGTH = 6;

function createGame(gameName: string, gameGenre: string, hostName: string, hostId: string) {
    return doesGameNameExist(gameName).then((_) => {
        console.log('game name does not exist, creating new game')
        const gameCode = generateGameCode();
        if(!gameName){
            gameName = `${hostName}'s Game`;    // Set gameName if not passed
        }
        const ganerateGameContentEndPoint = "https://us-central1-tuneiq.cloudfunctions.net/generateGameContent"
        const generateGameContentConfig: AxiosRequestConfig = {
            url: ganerateGameContentEndPoint,
            method: 'post',
            params:
            {
                genre: gameGenre,
                hostId: hostId,
                hostName: hostName,
                gameCode: gameCode,
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

function generateGameCode(){
    const message = (Math.random() * Date.now()).toString()    // Message computed from pseudo-random number and Epoch time
    var hexSHA256Digest = new Hashes.SHA256().hex(message);    // Run message through SHA256 hash function

    // Convert to byte array
    if (hexSHA256Digest.length % 2 !== 0) {
        hexSHA256Digest = '0' + hexSHA256Digest;
    }
    var digestBytes = [];
    for (var i = 0; i < hexSHA256Digest.length; i = i + 2) {
        digestBytes.push(parseInt(hexSHA256Digest.slice(i, i + 2), 16));
    }

    const b32SHA256Digest = base32.encode(digestBytes);       // Encode as base32
    const gameCode = b32SHA256Digest.substring(0, GAME_CODE_LENGTH).toUpperCase(); // Game code is first few chars of digest
    return gameCode;
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
    const supportedGenres = ["house", "dance", "hip-hop", "latin", "reggae", "techno"] //change at will
    return availableGenres['genres']
        .map((genre) => {
            return {
                name: genre,
                supported: supportedGenres.includes(genre),
                img: '',
            }
        });
}

function attemptToJoinGame(gameName: string, gameCode: string, playerId: string, playerName: string) {
    return getFirebaseApp().firestore().collection("games")
        .where("name", "==", gameName)
        .get().then((games) => {
            console.log(games)
            const gameId = games.docs[0].id;
            console.log(games.docs[0].data());
            if (gameCode === games.docs[0].data().gameCode) {
                return joinGame(gameId, playerId, playerName);
            } else {
                return Promise.reject({ field: "gameCode", message: "Invalid game code." });
            }

        }).catch((err) => (Promise.reject({ field: "gameName", message: "Game does not exist." })));
}


function joinGame(gameId: string, playerId: string, playerName: string) {
    const gameDocRef = getFirebaseApp().firestore().collection("games").doc(gameId);
    return getFirebaseApp().firestore().runTransaction((transaction) => {
        return transaction.get(gameDocRef).then(gameDoc => {
            if (!gameDoc.exists) {
                return Promise.reject(`Game Id ${gameId} is invalid`)
            }
            const gameData = gameDoc.data();
            const leaderBoard = gameData.leaderBoard;
            if (gameData.startTime != null){
                return Promise.reject(`Game ${gameId} has already started`);
            }
            else if (Object.keys(leaderBoard).length >= MAX_PLAYERS_PER_GAME) {
                return Promise.reject(`Game ${gameId} is full`);
            }
            else if (playerId in leaderBoard) {
                return Promise.reject(`Player ${playerId} has already joined game ${gameId}.`);
            }
            else {
                leaderBoard[playerId] = { "name": playerName, "score": 0 }
                transaction.update(gameDocRef, { 'leaderBoard': leaderBoard });
                return gameId;
            }
        })
    }).then(response => {
        return response
    }).catch(error => {
        return error
    })
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

function leaveGame(gameId: string, userId: string): Promise<string> {
    const gameDocRef = getFirebaseApp().firestore().collection("games").doc(gameId);
    return getFirebaseApp().firestore().runTransaction((transaction) => {
        return transaction.get(gameDocRef).then(gameDoc => {
            if (!gameDoc.exists) {
                return Promise.reject(`Game Id ${gameId} is invalid`)
            }
            const gameData = gameDoc.data();
            const leaderBoard = gameData.leaderBoard;
            if (!gameDoc.data().leaderBoard.hasOwnProperty(userId)) {
                return Promise.reject(`Player ${userId} is not in game ${gameId}.`);
            }
            if (Object.keys(leaderBoard).length > 1) {
                var newLeaderBoard = {}
                Object.keys(leaderBoard).forEach(playerId => {
                    if(playerId != userId){
                        newLeaderBoard[playerId] = leaderBoard[playerId];
                    }
                });
                transaction.update(gameDocRef, { 'leaderBoard': newLeaderBoard });
                const usersLeft = Object.keys(newLeaderBoard);
                if(gameData.hostId === userId){
                    const newHostId = usersLeft[usersLeft.length * Math.random() << 0];
                    transaction.update(gameDocRef, { 'hostId': newHostId })
                }
                return `Player ${userId} left game ${gameId}.`;
            }
            else {
                deleteGame(gameId);
                return `Player ${userId} left game ${gameId}, ending the game.`
            }
        })
    }).then(response => {
        return response
    }).catch(error => {
        return error
    })
}

/*
/ Returns the updated score
*/
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

function isUserInGame(gameId: string, userId: string): Promise<boolean> {
    return getFirebaseApp().firestore().collection("games")
        .doc(gameId)
        .get()
        .then(gameDoc => {
            if (!gameDoc.exists) {
                return Promise.reject(`Game Id: ${gameId} is invalid`)
            }

            if (gameDoc.data().leaderBoard.hasOwnProperty(userId)) {
                return true
            }
            return false
        }).catch(error => {
            return Promise.reject(error)
        })
}

function getGameIdByGameCode(gameCode: string): Promise<string> {
    return getFirebaseApp().firestore().collection("games")
        .where("gameCode", "==", gameCode)
        .get()
        .then(games => {
            if (games.empty) {
                return Promise.reject(`Game code ${gameCode} is invalid.`)
            }
            else if (games.size > 1) {
                return Promise.reject(`Game code ${gameCode} is not unique.`)
            } 
            else {
                return games.docs[0].id;
            }
        })
        .then((response) => {
            return response;
        }).catch((error) => {
            return error;
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
    isUserInGame,
    getGameIdByGameCode,
    generateGameCode
};