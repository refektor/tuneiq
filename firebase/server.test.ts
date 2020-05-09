
import * as server from './server';
import {getFirebaseApp} from "./firebase";
import { resolve } from 'dns';


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


describe("joinGame", () => {
    it("joins game successfully", () => {
        // GIVEN
        //jest.spyOn(server, 'db');
        //mockAdd.mockReturnValue()
        /*
        (getFirebaseApp as jest.Mock).mockReturnValue({
            firestore: () => ({
                collection: () => ({
                    add: () => {return 'yo'}
                })
            })
        })*/
        return server.joinGame("7iFDy0vaJnbxW3pYPgtu", "rCBxuA6zypN5PriubHjB", "dombresky").then(data => {
            console.log(data);
          }).catch(error => {
            console.log(error);
          });
    });
});
