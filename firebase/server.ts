import { getFirebaseApp } from './firebase'
import { generateGameContent, GameDetails } from './game_content'


function createGame(gameName: string, gamePassword: string, gameGenre: string, hostName: string, hostId: string) {
    return getFirebaseApp().firestore().collection("games").where("name", "==", gameName).get().then(games => {
        console.log(games.empty)
        if (games.empty) {
            console.log('weoo')
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
    createGame,
    joinGame,
    startGame,
    leaveGame,
    increasePlayerScore,
};