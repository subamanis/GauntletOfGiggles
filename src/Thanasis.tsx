import {FC, useMemo, useState} from "react";
import classnames from "classnames";
import GlobalStyles from "../src/assets/css/GlobalStyles.module.css"
import useMultiplayer from "./multiplayer/useMultiplayer.ts";
import {InfinityRoom, InfinityStoneColor} from "./multiplayer/infinityTypes.ts";

const ThanasisTest: FC = () => {
    const [roomInput, setRoomInput] = useState<string>();
    const [infinityColour, setInfinityColour] = useState<string>();
    const infinityRoom = useMemo<InfinityRoom>(() => {
        return {
            roomId: roomInput!,
        }
    }, [roomInput]);

    const {createRoom, joinRoom, useGetRoomState, useGetPlayerPlaying} = useMultiplayer();
    const roomState = useGetRoomState(infinityRoom);
    const playerPlaying = useGetPlayerPlaying(infinityRoom, infinityColour as InfinityStoneColor);

    const userClicksCreateRoom = () => {
        createRoom().then(room => {
            setRoomInput(room.roomId);
        });
    };

    const userClicksJoinRoom = () => {
        void joinRoom({roomId: roomInput!}, infinityColour as InfinityStoneColor);
    };

    return (
        <div className={classnames(GlobalStyles.flex, GlobalStyles.flexDirectionColumn)}>
            <button onClick={userClicksCreateRoom}>Create Room</button>
            <label>Room Name</label>
            <input value={roomInput} onChange={event => {
                setRoomInput(event.target.value)
            }}/>
            <button onClick={userClicksJoinRoom}>Join Room</button>
            <label>Color</label>
            <input value={infinityColour} onChange={event => {
                setInfinityColour(event.target.value)
            }}/>
            <label>Room State</label>
            <div>{JSON.stringify(roomState)}</div>
            <label>Player Playing</label>
            <div>{JSON.stringify(playerPlaying)}</div>
        </div>
    )
}

export default ThanasisTest;