
import * as server from './server';
import {getFirebaseApp} from "./firebase";

jest.mock('./firebase', () => {
    return {
        getFirebaseApp: jest.fn()
    }
});

describe("createGame", () => {
    it("create game successfully", () => {
        // GIVEN
        //jest.spyOn(server, 'db');
        //mockAdd.mockReturnValue()
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    add: () => {return 'yo'}
                })
            })
        })

    });
});
