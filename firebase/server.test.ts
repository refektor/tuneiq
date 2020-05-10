
import * as server from './server';
import { getFirebaseApp } from "./firebase";

jest.mock('./firebase', () => {
    return {
        getFirebaseApp: jest.fn()
    }
});

jest.mock('./game_content', () => {
    return {
        generateGameContent: jest.fn()
    }
})

describe("joinGame", () => {


    /**
     * tests player joining a game
     */
    it('join game successfully', () => {

        const expectedGameId = { id: 'g0000001' };
        const mockGet = jest.fn().mockResolvedValue({ empty: true });
        const mockUpdate = jest.fn().mockResolvedValue(expectedGameId);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    where: () => ({
                        get: mockGet
                    }),
                    update: mockUpdate,
                })
            })
        });
        const gameId = expectedGameId.id;
        const playerId = 'p0000001';
        const playerName = 'fekaroniAndCheese';

        /*
        return server.joinGame(gameId, playerId, playerName).then(res => {
            expect(mockUpdate).toHaveBeenCalledWith(expectedGameDetails)
            expect(res).toEqual(expectedGameId.id)
        })
        */
    })
});
