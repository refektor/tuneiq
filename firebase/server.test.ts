
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


describe("joinGame", () => {

    it('join game successfully', () => {
        const gameData = {
            id: 'g001',
            leaderBoard: {
                'p001': {name: 'vanboss', score: 0}
            }
        };
        const returnedGame = {
            exists: true,
            data: () => {
                return gameData;
            }
        }
        const expectedGameId = { id: 'g001' };
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        const mockUpdate = jest.fn().mockResolvedValue(null);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                        update: mockUpdate 
                    })
                })
            })
        });
        const gameId = expectedGameId.id;
        const playerId = 'p002';
        const playerName = 'fekaroniAndCheese';
        var leaderBoard = Object.assign({}, gameData.leaderBoard)
        leaderBoard['p002'] = {name: playerName, score: 0}

        return server.joinGame(gameId, playerId, playerName).then(res => {
            console.log(res);
            expect(mockUpdate).toHaveBeenCalledWith({ 'leaderBoard' : leaderBoard })
            expect(res).toEqual(expectedGameId.id)
            });
        /*
        return server.joinGame('acDZ0elZzToicGH9OJ3b', 'buaFDqbU3S6dHzqzZW2d', 'vanb').then(res => {
            console.log(res);
        });*/
    })

    it('player attempts to join nonexistent game', () => {
        const returnedGame = {
            exists: false,
        }
        const expectedGameId = { id: 'g001' };
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        const mockUpdate = jest.fn().mockResolvedValue(null);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                        update: mockUpdate 
                    })
                })
            })
        });
        const gameId = expectedGameId.id;
        const playerId = 'p002';
        const playerName = 'fekaroniAndCheese';

        return server.joinGame(gameId, playerId, playerName).then(res => {
            console.log(res);
            expect(res).toEqual(`Cannot find game with id ${gameId}.`)
            });
    });

    it('player attempts to join a game they are already in', () => {
        const gameData = {
            id: 'g001',
            leaderBoard: {
                'p001': {name: 'vanboss', score: 0},
                'p002': {name: 'dbaum', score: 0}
            }
        };
        const returnedGame = {
            exists: true,
            data: () => {
                return gameData;
            }
        }
        const expectedGameId = { id: 'g001' };
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        const mockUpdate = jest.fn().mockResolvedValue(null);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                        update: mockUpdate 
                    })
                })
            })
        });
        const gameId = expectedGameId.id;
        const playerId = 'p002';
        const playerName = 'dbaum';

        return server.joinGame(gameId, playerId, playerName).then(res => {
            console.log(res);
            expect(res).toEqual(`Player ${playerId} has already joined game ${gameId}.`)
            });
    });

    it('player attempts to join a full game', () => {
        const gameData = {
            id: 'g001',
            leaderBoard: {
                'p001': {name: 'vanboss', score: 0},
                'p002': {name: 'dbaum', score: 0},
                'p003': {name: 'anthoche', score: 0},
                'p004': {name: 'og', score: 0},
            }
        };
        const returnedGame = {
            exists: true,
            data: () => {
                return gameData;
            }
        }
        const expectedGameId = { id: 'g001' };
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        const mockUpdate = jest.fn().mockResolvedValue(null);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                        update: mockUpdate 
                    })
                })
            })
        });
        const gameId = expectedGameId.id;
        const playerId = 'p005';
        const playerName = 'fekalonius';

        return server.joinGame(gameId, playerId, playerName).then(res => {
            console.log(res);
            expect(res).toEqual(`Game ${gameId} is full`)
            });
    });
    
});