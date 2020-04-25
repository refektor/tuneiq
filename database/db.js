import { database } from "./firebase";

//const db = database().firestore();

export function fetchGames() {
    database.collection("games")
        .get()
        .then((games) => {
            //games.forEach((g) => {
            //    console.log(g)
            //});
            return games;
        })
        .catch((error) => {
            console.log(error);
        });
}