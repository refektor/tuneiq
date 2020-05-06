
import { createGame } from './server';

describe("server", () => {

jest.mock('./firebase', () => {
    return {};
})

describe("createGame", () => {
    it("create game successfully", () => {
        const gameId = createGame("name", "pass", { genre: "Hip Hop" })
        expect(gameId).toEqual("gameId");
    });
});

});