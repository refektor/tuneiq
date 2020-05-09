
import * as server from './server';
import { getFirebaseApp } from "./firebase";
import { generateGameContent, GameDetails } from './game_content'

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

describe("createGame", () => {
    it("successfully create game with valid params", () => {
        const expectedGameId = { id: "6969696969" }
        const mockAdd = jest.fn().mockResolvedValue(expectedGameId);
        const mockGet = jest.fn().mockResolvedValue({ empty: true });
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    where: () => ({
                        get: mockGet
                    }),
                    add: mockAdd,
                })
            })
        });
        const gameName = "daveEnjoysBubbleBaths"
        const password = "dmon"
        const hostId = "2323"
        const hostName = "david"
        const gameGenre = "classical"
        const expectedGameDetails: GameDetails = {
            name: gameName,
            password: password,
            hostId: hostId,
            intermissionDuration: NaN,
            roundDuration: NaN,
            startTime: null,
            genre: gameGenre,
            rounds: [],
            leaderBoard: {
                [hostId]: {
                    name: hostName,
                    score: 0
                }
            }
        };

        (generateGameContent as jest.Mock).mockResolvedValue(expectedGameDetails)

        return server.createGame(gameName, password, gameGenre, hostName, hostId).then(res => {
            expect(mockAdd).toHaveBeenCalledWith(expectedGameDetails)
            expect(res).toEqual(expectedGameId.id)
        })
    });

    it("fails to create game with game name already exists error", () => {
        const mockGet = jest.fn().mockResolvedValue({ empty: jest.fn().mockReturnValue(false) });
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    where: () => ({
                        get: mockGet
                    })
                })
            })
        });
        const gameName = "daveEnjoysBubbleBaths";
        const password = "dmon";
        const hostId = "2323";
        const hostName = "david";
        const gameGenre = "classical";
        const expectedMessage = "Game name already exists"
        return server.createGame(gameName, password, gameGenre, hostName, hostId).catch(error => {
            expect(error).toEqual(expectedMessage)
        })
    });

    it("fails to create game with database writing error", () => {
        const expectedErrorMessage = "Database Writing error"
        const mockGet = jest.fn().mockResolvedValue({ empty: true });
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    where: () => ({
                        get: mockGet
                    }),
                    add: jest.fn().mockImplementation(() => {
                        throw new Error(expectedErrorMessage)
                    }),
                })
            })
        });
        const gameName = "daveEnjoysBubbleBaths"
        const password = "dmon"
        const hostId = "2323"
        const hostName = "david"
        const gameGenre = "classical"
        const expectedGameDetails: GameDetails = {
            name: gameName,
            password: password,
            hostId: hostId,
            intermissionDuration: NaN,
            roundDuration: NaN,
            startTime: null,
            genre: gameGenre,
            rounds: [],
            leaderBoard: {
                [hostId]: {
                    name: hostName,
                    score: 0
                }
            }
        };

        (generateGameContent as jest.Mock).mockResolvedValue(expectedGameDetails)

        return server.createGame(gameName, password, gameGenre, hostName, hostId).catch(error => {
            expect(error).toEqual(expectedErrorMessage)
        })
    })
});
