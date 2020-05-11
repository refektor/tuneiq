import * as axios from 'axios';
import { getFirebaseApp } from './firebase'

const MAX_PLAYERS_PER_GAME = 4

function createGame(gameName: string, gamePassword: string, gameGenre: string, hostName: string, hostId: string) {
    return doesGameNameExist(gameName).then((_) => {
        console.log('game name does not exist, creating new game')
        const ganerateGameContentEndPoint = "https://us-central1-tuneiq.cloudfunctions.net/generateGameContent"
        const generateGameContentConfig: axios.AxiosRequestConfig = {
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

        return axios.default(generateGameContentConfig).then(gameDetails => {
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
                    return error
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
    const genres = {
        "genres": [
            "acoustic",
            "afrobeat",
            "alt-rock",
            "alternative",
            "ambient",
            "anime",
            "black-metal",
            "bluegrass",
            "blues",
            "bossanova",
            "brazil",
            "breakbeat",
            "british",
            "cantopop",
            "chicago-house",
            "children",
            "chill",
            "classical",
            "club",
            "comedy",
            "country",
            "dance",
            "dancehall",
            "death-metal",
            "deep-house",
            "detroit-techno",
            "disco",
            "disney",
            "drum-and-bass",
            "dub",
            "dubstep",
            "edm",
            "electro",
            "electronic",
            "emo",
            "folk",
            "forro",
            "french",
            "funk",
            "garage",
            "german",
            "gospel",
            "goth",
            "grindcore",
            "groove",
            "grunge",
            "guitar",
            "happy",
            "hard-rock",
            "hardcore",
            "hardstyle",
            "heavy-metal",
            "hip-hop",
            "holidays",
            "honky-tonk",
            "house",
            "idm",
            "indian",
            "indie",
            "indie-pop",
            "industrial",
            "iranian",
            "j-dance",
            "j-idol",
            "j-pop",
            "j-rock",
            "jazz",
            "k-pop",
            "kids",
            "latin",
            "latino",
            "malay",
            "mandopop",
            "metal",
            "metal-misc",
            "metalcore",
            "minimal-techno",
            "movies",
            "mpb",
            "new-age",
            "new-release",
            "opera",
            "pagode",
            "party",
            "philippines-opm",
            "piano",
            "pop",
            "pop-film",
            "post-dubstep",
            "power-pop",
            "progressive-house",
            "psych-rock",
            "punk",
            "punk-rock",
            "r-n-b",
            "rainy-day",
            "reggae",
            "reggaeton",
            "road-trip",
            "rock",
            "rock-n-roll",
            "rockabilly",
            "romance",
            "sad",
            "salsa",
            "samba",
            "sertanejo",
            "show-tunes",
            "singer-songwriter",
            "ska",
            "sleep",
            "songwriter",
            "soul",
            "soundtracks",
            "spanish",
            "study",
            "summer",
            "swedish",
            "synth-pop",
            "tango",
            "techno",
            "trance",
            "trip-hop",
            "turkish",
            "work-out",
            "world-music"
        ]
    }

    return genres['genres']
        .filter((genre) => { return genre === "classical" || genre === "dance" || genre === "guitar" || genre === "latin" || genre === "reggae" || genre === "techno" })
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
        //.where("password", "==", gamePassword)
        .get().then((games) => {
            console.log(games)
            const gameId = games.docs[0].id;
            console.log(games.docs[0].data());
            return joinGame(gameId, playerId, playerName);
        });
}


function joinGame(gameId: string, playerId: string, playerName: string) {
    console.log('heree', gameId)
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
    const startTime = new Date().getTime() + 5000; // 5 seconds
    getFirebaseApp().firestore().collection("games")
                .doc(gameId)
                .update({ startTime })
    return;
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
    leaveGame,
    increasePlayerScore,
};