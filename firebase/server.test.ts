import { FakeFirestore } from 'firestore-jest-mock';
import { 
    mockCollection, 
    mockWhere,
    mockGet
} from 'firestore-jest-mock/mocks/firestore';

// TODO: change these to test our db interfaces instead of actual db
// i.e test that db.fetchGame(name) expects to call mockWhere
describe('We can query', () => {
    const db = new FakeFirestore({
        database: {
            games: [
                { name: 'dirtytech', password: 'followthefish', genre: 'techhouse', players: null },
                { name: 'popstarz', password: 'imturning22', genre: 'pop', players: null },
            ],
        }
    });

    /**
     * tests the following:
     * can query collection 'games'
     * can query by where clause
     * 
     */
    test('fetch game', async () => {
        await db.collection("games")
            .where('name', '==','dirtytech')
            .get();

            expect(mockCollection).toHaveBeenCalledWith('games');
            expect(mockWhere).toHaveBeenCalledWith('name', '==', 'dirtytech');
            expect(mockGet).toHaveBeenCalled();
    });
});
