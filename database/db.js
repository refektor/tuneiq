import { database } from "./firebase";

const db = database().firestore();

export function fetchGames() {
    db.collection("games")
        .get()
        .then((games) => {
            games.forEach((g) => {
                console.log(g.data())
            });
        })
        .catch((error) => {
            console.log(error);
        });
}