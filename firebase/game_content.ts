import * as axios from 'axios';
import * as base64 from 'js-base64';

// Types -- TODO: find a better place to put these
export type GameDetails = {
    name: string,
    password: string,
    hostId: string,
    intermissionDuration: number,
    roundDuration: number,
    startTime: Date | null,
    genre: string,
    rounds: RoundDetails[],
    leaderBoard: {
        [id: string]: {
            name: string,
            score: number
        }
    }
}

type RoundDetails = {
    url: string
    tracks: GameTrack[]
}

type GameTrack = {
    id: string,
    title: string,
    artists: string[],
    isAnswer: boolean,
}

type SpotifyArtist = {
    id: string,
    name: string,
    //The Spotify URI for the artist
    uri: string
}

type SpotifyTrack = {
    id: string,
    artists: SpotifyArtist[],
    duration_ms: number,
    explict: boolean,
    name: string,
    preview_url: string,
    uri: string,
}

// Functions
export function generateGameContentStub(gameGenre: string, hostId: string, hostName: string, gameName: string, password: string) {
    return {
        hostId: hostId,
        name: gameName,
        password: password,
        genre: gameGenre,
        rounds: null,
        intermissionDuration: NaN,
        roundDuration: NaN,
        startTime: null,
        leaderBoard: {
            [hostId]: {
                name: hostName,
                score: 0
            }
        }
    }
}

export function generateGameContent(gameGenre: string, hostId: string, hostName: string, gameName: string, password: string) {
    const gameRounds: number = Number(5)
    const optionsPerRound: number = Number(4)

    return getRoundDetails(gameGenre, gameRounds, optionsPerRound).then((roundDetails: RoundDetails[]) => {
        const gameDetails: GameDetails = {
            hostId: hostId,
            name: gameName,
            password: password,
            genre: gameGenre,
            rounds: roundDetails,
            intermissionDuration: NaN,
            roundDuration: NaN,
            startTime: null,
            leaderBoard: {
                [hostId]: {
                    name: hostName,
                    score: 0
                }
            }
        }
        return gameDetails
    }).catch(error => {
        console.log(error)
        return error
    })
}

function getRoundDetails(gameGenre: string, gameRounds: number, optionsPerRound: number) {
    return getSpotifyToken().then(res => {
        const access_token = res
        return getSpotifyTracks(gameGenre, gameRounds, access_token, optionsPerRound).then((tracks: SpotifyTrack[]) => {
            const answerTracks: GameTrack[] = []
            const answerUrls: string[] = []

            // there is a chance that there will not be enough tracks with previews
            // TODO: add fallback logic to get more tracks with previews
            for (const track of tracks) {
                if (track.preview_url !== null) {
                    answerUrls.push(track.preview_url)
                    answerTracks.push({
                        id: track.id,
                        title: String(track.name),
                        artists: track.artists.map(artist => artist.name),
                        isAnswer: true,
                    })
                }
                if (answerUrls.length === gameRounds) {
                    break
                }
            }

            //making round objects
            const gameRoundDetails: RoundDetails[] = []
            for (let i = 0; i < gameRounds; i++) {
                const gameTracks: GameTrack[] = []
                gameTracks.push(answerTracks[i])
                for (let j = 0; j < tracks.length; j++) {
                    // Make sure we don't add the answer track
                    if (tracks[j].id === answerTracks[i].id) {
                        continue
                    }

                    gameTracks.push({
                        id: tracks[j].id,
                        title: tracks[j].name,
                        artists: tracks[j].artists.map(artist => artist.name),
                        isAnswer: false
                    })

                    if (gameTracks.length === optionsPerRound) {
                        break
                    }
                }

                gameRoundDetails.push({
                    url: answerUrls[i],
                    tracks: gameTracks
                })
            }

            return gameRoundDetails
        }).catch(err => {
            throw err
        })

    }).catch(err => {
        throw err
    })
}

function getSpotifyToken() {
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    //TODO: hide these values
    const clientId = "dd1bbbf5a2994eebb4777fa4e3315fcf";
    const clientSecret = "cbba1e3afe3648419d6609ef57285ecd";
    const authorization64 = base64.Base64.encode(`${clientId}:${clientSecret}`);

    const spotifyTokenRequestConfig: axios.AxiosRequestConfig = {
        url: tokenEndpoint,
        method: 'get',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authorization64}`
        },
        params:
        {
            grant_type: 'client_credentials'
        }
    }

    return axios.default(spotifyTokenRequestConfig).then((response) => {
        return response.data.access_token
    }).catch((error) => {
        console.log(error)
        throw error
    })
}

function getSpotifyTracks(gameGenre: string, gameRounds: number, access_token: string, optionsPerRound: number) {
    // Adding an extra 10 tracks to lower the possibility of not getting enough previews
    const spotifyResultLimit = gameRounds * optionsPerRound + 10
    const minPopularity = 50
    const spotifyRecommendationEndpoint =
        `https://api.spotify.com/v1/recommendations?limit=${spotifyResultLimit}&seed_genres=${gameGenre}&min_popularity=${minPopularity}`

    const spotifyRecommendationRequestConfig: axios.AxiosRequestConfig = {
        url: spotifyRecommendationEndpoint,
        method: 'get',
        headers: {
            "Accept": 'Accept: application/json',
            'Authorization': `Bearer ${access_token}`
        }
    }

    return axios.default(spotifyRecommendationRequestConfig).then(response => {
        const spotifyTracks: SpotifyTrack[] = []
        response.data.tracks.forEach((track: any) => {
            spotifyTracks.push({
                id: track.id,
                artists: track.artists.map((artist: any) => {
                    return {
                        id: artist.id,
                        name: artist.name,
                        uri: artist.uri
                    }
                }),
                duration_ms: track.duration_ms,
                explict: track.explict,
                name: track.name,
                preview_url: track.preview_url,
                uri: track.uri,
            })
        });
        return spotifyTracks
    }).catch(error => {
        throw error
    })
}


