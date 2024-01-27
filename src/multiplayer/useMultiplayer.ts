import {
    InfinityRoom,
    InfinityRoomData,
    InfinityStoneColor, PlayerPlaying,
    PlayerScore,
    RealtimeDatabasePaths,
    RoomState
} from "./infinityTypes.ts";
import {realTimeDatabase} from "../firebase/firebaseInit.ts";
import {DatabaseReference, get, onValue, ref, set, update} from "firebase/database";
import {useEffect, useMemo, useState} from "react";

interface useMultiplayerDefinition {
    createRoom: () => Promise<InfinityRoom>;
    useGetAvailablePlayersInRoom: (room: InfinityRoom) => InfinityStoneColor[];
    useGetRoomState: (room: InfinityRoom) => RoomState;
    useGetPlayerPlaying: (room: InfinityRoom, playerColor: InfinityStoneColor) => boolean;
    changeRoomState: (room: InfinityRoom, state: RoomState) => Promise<void>;
    joinRoom: (room: InfinityRoom, asPlayer: InfinityStoneColor) => Promise<boolean>;
    changePlayerScore: (room: InfinityRoom, playerColor: InfinityStoneColor, increment: number) => Promise<void>;
    changePlayerPlaying: (room: InfinityRoom, playerColor: InfinityStoneColor, playing: boolean) => Promise<void>;
}

const useMultiplayer = (): useMultiplayerDefinition => {
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
                return {
                    roomId: roomIdChosen!,
                } satisfies InfinityRoom;
            }
        );
    };

    const useGetAvailablePlayersInRoom = (room: InfinityRoom) => {
        return ['Red', 'Blue', 'Yellow', 'Purple', 'Green', 'Orange'] satisfies InfinityStoneColor[];
    };

    const useGetRoomState = (room: InfinityRoom) => {
        const [roomStateFromServer, setRoomStateFromServer] = useState<RoomState>(RoomState.NotStarted)
        const roomPath = useMemo(() => {
            return ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${room.roomId}/RoomState`);
        }, [room.roomId]);

        useEffect(() => {
            return onValue(roomPath, (snapshot) => {
                const roomState = snapshot.val() as RoomState;
                console.log("useMultiplayer", `Room ${room.roomId} changed state to ${roomState}`);
                setRoomStateFromServer(roomState);
            });
        }, [room.roomId, roomPath]);

        return roomStateFromServer;
    };

    const useGetPlayerPlaying = (room: InfinityRoom, playerColor: InfinityStoneColor) => {
        const [playerPlayingFromServer, setPlayerPlayingFromServer] = useState<boolean>(false);
        const playerPlaying =
            useMemo(() => {
                return `${playerColor}Playing` as PlayerPlaying;
            }, [playerColor]);
        const playerPlayingPath =
            useMemo(() => {
                return ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${room.roomId}/${playerPlaying}`);
            }, [room.roomId, playerPlaying]);

        useEffect(() => {
            return onValue(playerPlayingPath, (snapshot) => {
                const playerPlaying = snapshot.val() as boolean;
                console.log("useMultiplayer", `Player ${playerColor} playing changed to ${playerPlaying}`);
                setPlayerPlayingFromServer(playerPlaying);
            });
        }, [room.roomId, playerPlayingPath, playerColor]);

        return playerPlayingFromServer;
    }

    const changeRoomState = (room: InfinityRoom, state: RoomState) => {
        console.log("useMultiplayer", `Room ${room.roomId} changed state to ${state}`);
        const roomPath = ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${room.roomId}`);
        return update(roomPath, {
                RoomState: state,
            } satisfies Pick<InfinityRoomData, 'RoomState'>
        );
    };

    const joinRoom = async (room: InfinityRoom, asPlayer: InfinityStoneColor) => {
        console.log("useMultiplayer", `Player ${asPlayer} joined room ${room.roomId}`);
        const playerScore: PlayerScore = `${asPlayer}Score` as PlayerScore;
        const playerExists = await get(ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${room.roomId}/${playerScore}`))
            .then((snapshot) => snapshot.exists());

        if (playerExists) {
            const errorMessage = `Player ${asPlayer} already exists in room ${room.roomId}`;
            console.log("useMultiplayer", errorMessage);
            return Promise.reject(errorMessage);
        }

        const roomPath = ref(realTimeDatabase, `${RealtimeDatabasePaths.rooms}/${room.roomId}`);
        return update(roomPath, {
                [playerScore]: 0,
            } as Pick<InfinityRoomData, PlayerScore>
        );
    };

    const changePlayerScore = (room: InfinityRoom, playerColor: InfinityStoneColor, increment: number) => {
        console.log("useMultiplayer", `Player ${playerColor} score changed by ${increment}`);
    };

    const changePlayerPlaying = (room: InfinityRoom, playerColor: InfinityStoneColor, playing: boolean) => {
        console.log("useMultiplayer", `Player ${playerColor} playing changed to ${playing}`);

    }

    return {
        createRoom,
        useGetAvailablePlayersInRoom,
        useGetRoomState,
        useGetPlayerPlaying,
        changeRoomState,
        joinRoom,
        changePlayerScore,
        changePlayerPlaying,
    }
}

export default useMultiplayer;