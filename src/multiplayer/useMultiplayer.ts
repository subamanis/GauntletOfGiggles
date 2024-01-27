import {
    InfinityRoomData, InfinityRoomDataScoresNumber, InfinityRoomDataScoresIncrementBy,
    InfinityStoneColor, PlayerPlaying,
    PlayerScore,
    RealtimeDatabasePaths,
    RoomState, infinityStoneColorsInArray
} from "./infinityTypes.ts";
import {realTimeDatabase} from "../firebase/firebaseInit.ts";
import {DatabaseReference, get, onValue, ref, set, update, increment} from "firebase/database";
import {useEffect, useMemo, useState} from "react";

interface useMultiplayerDefinition {
    createRoom: () => Promise<string>;
    useGetAvailablePlayersInRoom: (roomId: string) => InfinityStoneColor[];
    useGetRoomState: (roomId: string) => RoomState;
    useGetPlayerPlaying: (roomId: string, playerColor: InfinityStoneColor) => boolean;
    useGetPlayersScore: (roomId: string) => number;
    changeRoomState: (roomId: string, state: RoomState) => Promise<void>;
    joinRoom: (roomId: string, asPlayer: InfinityStoneColor) => Promise<void>;
    changePlayerScore: (roomId: string, playerColor: InfinityStoneColor, increment: number) => Promise<void>;
    changePlayerPlaying: (roomId: string, playerColor: InfinityStoneColor, playing: boolean) => Promise<void>;

}

const useMultiplayer = (): useMultiplayerDefinition => {

    const useMultiplayerInstance = useMemo(() => {

        const createRoom = async () => {
            let roomExists = false;
            let roomIdChosen: null | string = null;
            let roomPath: DatabaseReference | null = null;
            do {
                // roomId is always 4 digits and over 1000
                roomIdChosen = (Math.floor(Math.random() * 9000) + 1000).toString();
                roomPath = ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${roomIdChosen}`);
                roomExists = await get(roomPath).then((snapshot) => {
                    return snapshot.exists()
                });
            } while (roomExists);


            return set(roomPath, {
                    RoomState: RoomState.WaitingForPlayers,
                } satisfies Pick<InfinityRoomData, 'RoomState'>
            ).then(() => {
                    console.log("useMultiplayer", `Room ${roomIdChosen} created`);
                    return roomIdChosen!;
                }
            );
        };

        const useGetAvailablePlayersInRoom = (roomId: string) => {
            const [availablePlayersFromServer, setAvailablePlayersFromServer] = useState<InfinityStoneColor[]>([]);
            const roomPath = useMemo(() => {
                return ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${roomId}/${RealtimeDatabasePaths.scores}`);
            }, [roomId]);

            useEffect(() => {
                return onValue(roomPath, (snapshot) => {
                    const scores = (snapshot.val() ?? {}) as InfinityRoomDataScoresNumber;
                    const activePlayers = Object.keys(scores).map((key) => key.replace("Score", "")) as InfinityStoneColor[];
                    // get all values from InfinityStoneColor
                    const availablePlayers = infinityStoneColorsInArray.filter((color) => !activePlayers.includes(color));
                    console.log("useMultiplayer", `Room ${roomId} changed available players to ${availablePlayers}`);
                    setAvailablePlayersFromServer(availablePlayers as InfinityStoneColor[]);
                });
            }, [roomId, roomPath]);

            return availablePlayersFromServer;
        };

        const useGetRoomState = (roomId: string) => {
            const [roomStateFromServer, setRoomStateFromServer] = useState<RoomState>(RoomState.NotStarted)
            const roomPath = useMemo(() => {
                return ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${roomId}/RoomState`);
            }, [roomId]);

            useEffect(() => {
                return onValue(roomPath, (snapshot) => {
                    const roomState = snapshot.val() as RoomState;
                    console.log("useMultiplayer", `Room ${roomId} changed state to ${roomState}`);
                    setRoomStateFromServer(roomState);
                });
            }, [roomId, roomPath]);

            return roomStateFromServer;
        };

        const useGetPlayerPlaying = (roomId: string, playerColor: InfinityStoneColor) => {
            const [playerPlayingFromServer, setPlayerPlayingFromServer] = useState<boolean>(false);
            const playerPlaying =
                useMemo(() => {
                    return `${playerColor}Playing` as PlayerPlaying;
                }, [playerColor]);
            const playerPlayingPath =
                useMemo(() => {
                    return ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${roomId}/${playerPlaying}`);
                }, [roomId, playerPlaying]);

            useEffect(() => {
                return onValue(playerPlayingPath, (snapshot) => {
                    const playerPlaying = snapshot.val() as boolean;
                    console.log("useMultiplayer", `Player ${playerColor} playing changed to ${playerPlaying}`);
                    setPlayerPlayingFromServer(playerPlaying);
                });
            }, [roomId, playerPlayingPath, playerColor]);

            return playerPlayingFromServer;
        }

        const changeRoomState = (roomId: string, state: RoomState) => {
            console.log("useMultiplayer", `Room ${roomId} changed state to ${state}`);
            const roomPath = ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${roomId}`);
            return update(roomPath, {
                    RoomState: state,
                } satisfies Pick<InfinityRoomData, 'RoomState'>
            );
        };

        const joinRoom = async (roomId: string, asPlayer: InfinityStoneColor) => {
            console.log("useMultiplayer", `Player ${asPlayer} joined room ${roomId}`);
            const playerScore: PlayerScore = `${asPlayer}Score` as PlayerScore;
            const playerExists = await get(ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${roomId}/${RealtimeDatabasePaths.scores}/${RealtimeDatabasePaths.scores}`))
                .then((snapshot) => snapshot.exists());

            if (playerExists) {
                const errorMessage = `Player ${asPlayer} already exists in room ${roomId}`;
                console.log("useMultiplayer", errorMessage);
                return Promise.reject(errorMessage);
            }

            const roomPath = ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${roomId}/${RealtimeDatabasePaths.scores}`);
            return update(roomPath, {
                    [playerScore]: 0,
                } as Pick<InfinityRoomDataScoresNumber, PlayerScore>
            );
        };

        const changePlayerScore = (roomId: string, playerColor: InfinityStoneColor, incrementBy: number) => {
            console.log("useMultiplayer", `Player ${playerColor} score changed by ${increment}`);
            const playerScore: PlayerScore = `${playerColor}Score` as PlayerScore;
            const roomPath = ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${roomId}/${RealtimeDatabasePaths.scores}`);
            return update(roomPath, {
                    [playerScore]: increment(incrementBy),
                } as Pick<InfinityRoomDataScoresIncrementBy, PlayerScore>
            );
        };

        const useGetPlayersScore = (roomId: string) => {
            const [playersScoreFromServer, setPlayersScoreFromServer] = useState<number>(0);
            const roomPath = useMemo(() => {
                return ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${roomId}/${RealtimeDatabasePaths.scores}`);
            }, [roomId]);

            useEffect(() => {
                return onValue(roomPath, (snapshot) => {
                    const scores = snapshot.val() as InfinityRoomDataScoresNumber;
                    const playersScore = scores ? Object.values(scores).reduce((accumulator, currentValue) => accumulator + currentValue) : 0;
                    console.log("useMultiplayer", `Room ${roomId} changed score to ${playersScore}`);
                    setPlayersScoreFromServer(playersScore);
                });
            }, [roomId, roomPath]);

            return playersScoreFromServer;
        }

        const changePlayerPlaying = (roomId: string, playerColor: InfinityStoneColor, playing: boolean) => {
            console.log("useMultiplayer", `Player ${playerColor} playing just changed to ${playing}`);

            const playerPlaying: PlayerPlaying = `${playerColor}Playing` as PlayerPlaying;
            const roomPath = ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${roomId}`);
            return update(roomPath, {
                    [playerPlaying]: playing,
                } as Pick<InfinityRoomData, PlayerPlaying>
            );
        }

        return {
            createRoom,
            useGetAvailablePlayersInRoom,
            useGetRoomState,
            useGetPlayerPlaying,
            changeRoomState,
            joinRoom,
            changePlayerScore,
            useGetPlayersScore,
            changePlayerPlaying,
        }

    }, []);

    return useMultiplayerInstance;
}

export default useMultiplayer;