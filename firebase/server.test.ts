import * as server from './server';
import { getFirebaseApp } from "./firebase";
import axios from 'axios';
import { AxiosStatic } from 'axios'

jest.mock('./firebase')
jest.mock('./firebase', () => {
    return {
        getFirebaseApp: jest.fn()
    }
});

jest.mock('axios')


describe("createGame", () => {
    it("successfully create game with valid params", () => {
        const expectedGameId = { id: "6969696969" }
        const gameName = "daveEnjoysBubbleBaths"
        const password = "dmon"
        const hostId = "2323"
        const hostName = "david"
        const gameGenre = "classical"
        const expectedGameDetails = {
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
        const mockedAxios = axios as jest.Mocked<AxiosStatic>
        const mockedAxiosReponse = {
            data: expectedGameDetails
        }
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


        mockedAxios.request.mockResolvedValue(mockedAxiosReponse)

        return server.createGame(gameName, password, gameGenre, hostName, hostId).then(res => {
            expect(mockAdd).toHaveBeenCalledWith(expectedGameDetails)
            expect(res).toEqual(expectedGameId.id)
        })
    });

    it("fails to create game with game name already exists error", () => {
        const gameName = "asssah";
        const password = "dmon";
        const hostId = "2323";
        const hostName = "david";
        const gameGenre = "classical";
        const expectedMessage = `Game name: ${gameName}, already exists`;
        const mockGet = jest.fn().mockResolvedValue({ empty: false });
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    where: () => ({
                        get: mockGet
                    })
                })
            })
        });

        return server.createGame(gameName, password, gameGenre, hostName, hostId).catch(error => {
            expect(error).toEqual(expectedMessage)
        })
    });

    it("fails to create game with database writing error", () => {
        const expectedErrorMessage = "Database Writing error";
        const ecpectedError = new Error(expectedErrorMessage)
        const gameName = "daveEnjoysBubbleBaths"
        const password = "dmon"
        const hostId = "2323"
        const hostName = "david"
        const gameGenre = "classical"
        const expectedGameDetails = {
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

        const mockedAxios = axios as jest.Mocked<AxiosStatic>
        const mockedAxiosReponse = {
            data: expectedGameDetails
        }
        mockedAxios.request.mockResolvedValue(mockedAxiosReponse)
        const mockGet = jest.fn().mockResolvedValue({ empty: true });
        const mockAdd = jest.fn().mockImplementation(() => {
            throw ecpectedError
        });

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

        return server.createGame(gameName, password, gameGenre, hostName, hostId).catch(error => {
            expect(mockAdd).toHaveBeenCalledWith(expectedGameDetails)
            expect(error).toEqual(ecpectedError)
        })
    })
});

describe("joinGame", () => {
    it('join game successfully', () => {
        const gameData = {
            id: 'g001',
            leaderBoard: {
                'p001': { name: 'vanboss', score: 0 }
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
        leaderBoard['p002'] = { name: playerName, score: 0 }

        return server.joinGame(gameId, playerId, playerName).then(res => {
            console.log(res);
            expect(mockUpdate).toHaveBeenCalledWith({ 'leaderBoard': leaderBoard })
            expect(res).toEqual(expectedGameId.id)
        });
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
                'p001': { name: 'vanboss', score: 0 },
                'p002': { name: 'dbaum', score: 0 }
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
                'p001': { name: 'vanboss', score: 0 },
                'p002': { name: 'dbaum', score: 0 },
                'p003': { name: 'anthoche', score: 0 },
                'p004': { name: 'og', score: 0 },
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

// TODO: Add more tests for this function. No test coverage currently for inner lambda function
describe("increasePlayerScore", () => {
    it("successfully updated score", () => {
        const userId = "123Dave";
        const gameId = "davesFancyGame";
        const expectedScore = 200;
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => {
                        return "docRef"
                    }
                }),
                runTransaction: jest.fn().mockResolvedValue(expectedScore)
            }),

        });

        return server.increasePlayerScore(gameId, userId, 10).then(score => {
            expect(score).toEqual(expectedScore)
        })
    });
    it("Fails to updateScore due to transaction error", () => {
        const userId = "123Dave";
        const gameId = "davesFancyGame";
        const expectedErrorMessage = "Transaction Error";
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => {
                        return "docRef"
                    }
                }),
                runTransaction: jest.fn().mockResolvedValue(new Error(expectedErrorMessage))
            }),
        });

        return server.increasePlayerScore(gameId, userId, 10).catch(error => {
            expect(error).toEqual(expectedErrorMessage)
        })
    });
});


describe("isUserInGame", () => {
    it("returns true with valid userId in game", () => {
        const gameId = "12313";
        const userId = "asdf"
        const expectedResult = true;
        const mockedData = jest.fn().mockReturnValue(
            {
                leaderBoard: {
                    [userId]: { name: 'vanboss', score: 0 }
                }
            });
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: jest.fn().mockResolvedValue({
                            exists: true,
                            data: mockedData
                        })
                    })
                })
            }),
        });

        return server.isUserInGame(gameId, userId).then((response: boolean) => {
            expect(response).toEqual(expectedResult);
            expect(mockedData).toBeCalledTimes(1)
        })

    });
    it("returns false with invalid userId in game", () => {
        const gameId = "12313";
        const userId = "asdf"
        const expectedResult = false;
        const mockedData = jest.fn().mockReturnValue(
            {
                leaderBoard: {}
            });
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: jest.fn().mockResolvedValue({
                            exists: true,
                            data: mockedData
                        })
                    })
                })
            }),
        });

        return server.isUserInGame(gameId, userId).then((response: boolean) => {
            expect(response).toEqual(expectedResult);
            expect(mockedData).toBeCalledTimes(1)
        })

    });
    it("returns error with invalid gameId", () => {
        const gameId = "12313";
        const userId = "asd"
        const expectedResult = `Game Id: ${gameId} is invalid`;

        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: jest.fn().mockResolvedValue({
                            exists: false,
                        })
                    })
                })
            }),
        });

        return server.isUserInGame(gameId, userId).catch((error) => {
            expect(error).toEqual(expectedResult);
        })

    })
});


describe("deleteGame", () => {

    it('delete game successfully', () => {
        const gameData = {
            id: 'g001',
            leaderBoard: {
                'p001': { name: 'vanboss', score: 0 }
            }
        };
        const returnedGame = {
            exists: true,
            data: () => {
                return gameData;
            }
        }
        const expectedGameId = { id: 'g001' };
        const expectedDeleteResponse = `Game ${expectedGameId} was deleted.`;
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                    })
                }),
                runTransaction: jest.fn().mockResolvedValue(expectedDeleteResponse)
            })
        });
        const gameId = expectedGameId.id;

        return server.deleteGame(gameId).then(res => {
            console.log(res);
            expect(res).toEqual(expectedDeleteResponse);
        });
    });

    it('could not find game to delete', () => {
        const returnedGame = {
            exists: false
        }
        const expectedGameId = { id: 'g001' };
        const expectedDeleteResponse = `Game Id: ${expectedGameId.id} is invalid.`;
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                    })
                }),
                runTransaction: jest.fn().mockResolvedValue(expectedDeleteResponse)
            })
        });
        const gameId = expectedGameId.id;

        return server.deleteGame(gameId).then(res => {
            console.log(res);
            expect(res).toEqual(expectedDeleteResponse);
        });
    });
});

// NOTE: for now, end game functionality only includes deleting a game
describe("endGame", () => {

    it('end game successfully', () => {
        const gameData = {
            id: 'g001',
            leaderBoard: {
                'p001': { name: 'vanboss', score: 0 }
            }
        };
        const returnedGame = {
            exists: true,
            data: () => {
                return gameData;
            }
        }
        const expectedGameId = { id: 'g001' };
        const expectedDeleteResponse = `Game ${expectedGameId} was deleted.`;
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                    })
                }),
                runTransaction: jest.fn().mockResolvedValue(expectedDeleteResponse)
            })
        });
        const gameId = expectedGameId.id;

        return server.endGame(gameId).then(res => {
            console.log(res);
            expect(res).toEqual(expectedDeleteResponse);
        });
    });

    it('could not find game to end', () => {
        const returnedGame = {
            exists: false
        }
        const expectedGameId = { id: 'g001' };
        const expectedDeleteResponse = `Game Id: ${expectedGameId.id} is invalid.`;
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                    })
                }),
                runTransaction: jest.fn().mockResolvedValue(expectedDeleteResponse)
            })
        });
        const gameId = expectedGameId.id;

        return server.deleteGame(gameId).then(res => {
            console.log(res);
            expect(res).toEqual(expectedDeleteResponse);
        });
    });
});


describe("leaveGame", () => {

    it('non-host non-last player left game successfully', () => {
        const gameData = {
            id: 'g001',
            hostId: 'p001',
            leaderBoard: {
                'p001': { name: 'vanboss', score: 99 },
                'p002': { name: 'dizzybaum', score: 98 },
                'p003': { name: 'antholini', score: 97 }
            }
        };
        const returnedGame = {
            exists: true,
            data: () => {
                return gameData;
            }
        }
        const expectedGameId = { id: 'g001' };
        const leavingPlayerId = 'p002';
        const expectedResponse = `Player ${leavingPlayerId} left game ${expectedGameId.id}.`;
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                    })
                }),
                runTransaction: jest.fn().mockResolvedValue(expectedResponse)
            })
        });
        const gameId = expectedGameId.id;

        return server.leaveGame(gameId, leavingPlayerId).then(res => {
            console.log(res);
            expect(res).toEqual(expectedResponse);
        });
    });

    it('host non-last player left game successfully', () => {
        const gameData = {
            id: 'g001',
            hostId: 'p001',
            leaderBoard: {
                'p001': { name: 'vanboss', score: 99 },
                'p002': { name: 'dizzybaum', score: 98 },
                'p003': { name: 'antholini', score: 97 }
            }
        };
        const returnedGame = {
            exists: true,
            data: () => {
                return gameData;
            }
        }
        const expectedGameId = { id: 'g001' };
        const leavingPlayerId = 'p001';
        const expectedResponse = `Player ${leavingPlayerId} left game ${expectedGameId.id}.`;
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                    })
                }),
                runTransaction: jest.fn().mockResolvedValue(expectedResponse)
            })
        });
        const gameId = expectedGameId.id;

        return server.leaveGame(gameId, leavingPlayerId).then(res => {
            console.log(res);
            expect(res).toEqual(expectedResponse);
        });
    });

    it('last player left game successfully', () => {
        const gameData = {
            id: 'g001',
            hostId: 'p001',
            leaderBoard: {
                'p001': { name: 'vanboss', score: 99 },
            }
        };
        const returnedGame = {
            exists: true,
            data: () => {
                return gameData;
            }
        }
        const expectedGameId = { id: 'g001' };
        const leavingPlayerId = 'p001';
        const expectedResponse = `Game ${expectedGameId.id} was deleted.`;
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                    })
                }),
                runTransaction: jest.fn().mockResolvedValue(expectedResponse)
            })
        });
        const gameId = expectedGameId.id;

        return server.leaveGame(gameId, leavingPlayerId).then(res => {
            console.log(res);
            expect(res).toEqual(expectedResponse);
        });
    });

    it('player tries to leave game they are not in', () => {
        const gameData = {
            id: 'g001',
            hostId: 'p001',
            leaderBoard: {
                'p001': { name: 'vanboss', score: 99 },
            }
        };
        const returnedGame = {
            exists: true,
            data: () => {
                return gameData;
            }
        }
        const expectedGameId = { id: 'g001' };
        const leavingPlayerId = 'p002';
        const expectedResponse = `Player ${leavingPlayerId} is not in game ${expectedGameId.id}.`;
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                    })
                }),
                runTransaction: jest.fn().mockResolvedValue(expectedResponse)
            })
        });
        const gameId = expectedGameId.id;

        return server.leaveGame(gameId, leavingPlayerId).then(res => {
            console.log(res);
            expect(res).toEqual(expectedResponse);
        });
    });

    it('could not find game to leave', () => {
        const returnedGame = {
            exists: false
        }
        const expectedGameId = { id: 'g001' };
        const leavingPlayerId = 'p002';
        const expectedResponse = `Game Id ${expectedGameId.id} is invalid.`;
        const mockGet = jest.fn().mockResolvedValue(returnedGame);
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        get: mockGet,
                    })
                }),
                runTransaction: jest.fn().mockResolvedValue(expectedResponse)
            })
        });
        const gameId = expectedGameId.id;

        return server.leaveGame(gameId, leavingPlayerId).then(res => {
            console.log(res);
            expect(res).toEqual(expectedResponse);
        });
    });
});
