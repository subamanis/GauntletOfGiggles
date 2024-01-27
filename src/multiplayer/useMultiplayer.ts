import {InfinityRoom, InfinityStoneColor, RoomState} from "./infinityTypes.ts";

interface useMultiplayerDefinition {
    createRoom: () => InfinityRoom;
    useGetAvailablePlayersInRoom: (room: InfinityRoom) => InfinityStoneColor[];
    useGetRoomState: (room: InfinityRoom) => RoomState;
    changeRoomState: (room: InfinityRoom, state: RoomState) => void;
    joinRoom: (room: InfinityRoom, asPlayer: InfinityStoneColor) => boolean;
    changePlayerScore: (room: InfinityRoom, playerColor: InfinityStoneColor, increment: number) => void;
    changePlayerPlaying: (room: InfinityRoom, playerColor: InfinityStoneColor, playing: boolean) => void;
}

const useMultiplayer = (): useMultiplayerDefinition => {
    const createRoom = () => {
        return {
            roomId: '123',
        }
    };

    const useGetAvailablePlayersInRoom = (room: InfinityRoom) => {
        return ['Red', 'Blue', 'Yellow', 'Purple', 'Green', 'Orange'] satisfies InfinityStoneColor[];
    };

    const useGetRoomState = (room: InfinityRoom) => {
        return RoomState.WaitingForPlayers;
    };

    const changeRoomState = (room: InfinityRoom, state: RoomState) => {
        console.log(`Room ${room.roomId} state changed to ${state}`);
    };

    const joinRoom = (room: InfinityRoom, asPlayer: InfinityStoneColor) => {
        console.log(`Player ${asPlayer} joined room ${room.roomId}`);
        return true;
    };

    const changePlayerScore = (room: InfinityRoom, playerColor: InfinityStoneColor, increment: number) => {
        console.log(`Player ${playerColor} score changed by ${increment}`);
    };

    const changePlayerPlaying = (room: InfinityRoom, playerColor: InfinityStoneColor, playing: boolean) => {
        console.log(`Player ${playerColor} playing changed to ${playing}`);

    }

    return {
        createRoom,
        useGetAvailablePlayersInRoom,
        useGetRoomState,
        changeRoomState,
        joinRoom,
        changePlayerScore,
        changePlayerPlaying,
    }
}

export default useMultiplayer;