import { database } from "./firebase";

const db = database().firestore();

/**
 * 
 * @param game name of game
 */
export async function fetchGame(game) {
    const result = []
    await db.collection("games")
        .where("name", "==", game)
        .get()
        .then(games => {
            games.forEach(g => {
                result.push(g.data())
            });
        })
        .catch(error => {
            console.log(error);
        });
    
    return result;
}

/**
 * 1. create player, should not be in db since they are just creating this new game
 * 2. create game with player as admin
 * db.createGame("kneedeep", "inlouise", "techhouse", "hotsince82");
 * @param name name of game
 * @param password password of game
 * @param genre genre of game
 * @param players players in this containing only current player as admin. { playerName: true }
 */
export async function createGame(name, password, genre, player) {
    const newGame = { name, password, genre }
    newGame['players'] = {}
    newGame['players'][player] = true;

    //createPlayer(player);
    console.log("name game", newGame);
    //return; // don't add to db yet
    
    db.collection("games")
        .add(newGame)
        .then((docRef) => {
            console.log("succesfully created game with id: ", docRef.id);
        })
        .catch((error) => {
            console.log(error);
        });
}

/**
 * 
 * @param name name of player
 */
export async function createPlayer(uid, name) {
    const newPlayer = { uid, name }
    console.log("new player: ", newPlayer);
    //return; // don't add to db yet
    db.collection("players")
        .doc()
        .set(newPlayer)
        .then((docRef) => {
            console.log("succesfully created player with id: ", uid);
        })
        .catch((error) => {
            console.log(error);
        });
}

/**
 * 
 * @param player name of player
 */
export async function fetchPlayer(player) {
    const result = []
    await db.collection("players")
        .where("name", "==", player)
        .get()
        .then(players => {
            players.forEach(p => {
                result.push(p.data())
            });
        })
        .catch(error => {
            console.log(error);
        });
    
    return result;
}

/**
 * 
 * @param player name of player
 */
export async function fetchPlayerById(id) {
    const result = []
    await db.collection("players")
        .where("uid", "==", id)
        .get()
        .then(players => {
            players.forEach(p => {
                console.log(p.data())
                result.push(p.data())
            });
        })
        .catch(error => {
            console.log(error);
        });

    return result;
}

/**
 * i.e. addPlayerToGame("kneedeep", "domdolla");
 * @param game name of game
 * @param player name of player to add to this game
 */
export async function addPlayerToGame(game, player) {
    const result = []
    await db.collection("games")
        .where("name", "==", game)
        .get()
        .then(games => {
            games.forEach(g => {
                const players = g.data().players;
                players[player] = false
                db.collection("games")
                    .doc(g.id)
                    .update({ 'players' : players })
            });
        })
        .catch(error => {
            console.log(error);
        });
    
    return result;
}