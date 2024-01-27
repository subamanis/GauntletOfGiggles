import {
    InfinityRoom,
    InfinityRoomData,
    InfinityStoneColor,
    PlayerScore,
    RealtimeDatabasePaths,
    RoomState
} from "./infinityTypes.ts";
import {realTimeDatabase} from "../firebase/firebaseInit.ts";
import {DatabaseReference, get, ref, set, update} from "firebase/database";

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
        return RoomState.WaitingForPlayers;
    };

    const useGetPlayerPlaying = (room: InfinityRoom, playerColor: InfinityStoneColor) => {
        return false;
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