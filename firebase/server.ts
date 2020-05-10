import { getFirebaseApp } from './firebase'
import { generateGameContent, generateGameContentStub, GameDetails } from './game_content'

function createGame(gameName: string, gamePassword: string, gameGenre: string, hostName: string, hostId: string) {
    doesGameNameExist(gameName).then((_) => {
        console.log('game name does not exist, creating new game')
        const gameContent = generateGameContentStub(gameGenre, hostId, hostName, gameName, gamePassword);
        return getFirebaseApp().firestore().collection("games")
            .add(gameContent)
            .then((docRef) => {
                console.log(docRef)
                console.log("succesfully created game with id: ", docRef.id);
                return docRef.id
            })
            .catch((error) => {
                console.log(error);
                return error
            });
        /*
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
        });
        */
    });
}

function doesGameNameExist(name) {
    return getFirebaseApp().firestore().collection("games")
        .where("name", "==", name)
        .get()
        .then(games => {
            if (!games.empty) {
                return Promise.reject("Game name already exists")
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
        .filter((genre) => {return genre === "classical" || genre === "dance" || genre === "guitar" || genre === "latin" || genre === "reggae" || genre === "techno"})
        .map((genre) => {
            return {
                genre: genre,
                img: `../${genre}.jpg`
            }
        });
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

function increasePlayerScore(gameId: string, userId: string, timeSinceRoundStart: number): void {
    return;
}

export {
    doesGameNameExist,
    getPossibleGenres,
    createGame,
    joinGame,
    startGame,
    leaveGame,
    increasePlayerScore,
};