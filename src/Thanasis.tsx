import {FC, useState} from "react";
import classnames from "classnames";
import GlobalStyles from "../src/assets/css/GlobalStyles.module.css"
import useMultiplayer from "./multiplayer/useMultiplayer.ts";
import {InfinityStoneColor, RoomState} from "./multiplayer/infinityTypes.ts";

const ThanasisTest: FC = () => {
    const [roomInput, setRoomInput] = useState<string>();
    const [infinityColour, setInfinityColour] = useState<string>();
    const [roomStateWrite, setRoomStateWrite] = useState<string>();


    const {
        createRoom,
        joinRoom,
        useGetRoomState,
        useGetPlayerPlaying,
        changePlayerScore,
        useGetPlayersScore,
        changeRoomState,
        changePlayerPlaying,
        useGetAvailablePlayersInRoom,
    } = useMultiplayer();
    const roomState = useGetRoomState(roomInput!);
    const playerPlaying = useGetPlayerPlaying(roomInput!, infinityColour as InfinityStoneColor);
    const totalScore = useGetPlayersScore(roomInput!);
    const availablePlayersInRoom = useGetAvailablePlayersInRoom(roomInput!);

    const userClicksCreateRoom = () => {
        createRoom().then(roomId => {
            setRoomInput(roomId);
        });
    };

    const userClicksJoinRoom = () => {
        void joinRoom(roomInput!, infinityColour as InfinityStoneColor);
    };

    return (
        <div className={classnames(GlobalStyles.flex, GlobalStyles.flexDirectionColumn)}>
            <button onClick={userClicksCreateRoom}>Create Room</button>
            <p/>
            <label>Room Id</label>
            <input value={roomInput} onChange={event => {
                setRoomInput(event.target.value)
            }}/>
            <p/>
            <label>Available Players</label>
            <div>{JSON.stringify(availablePlayersInRoom)}</div>
            <button onClick={userClicksJoinRoom}>Join Room</button>
            <p/>
            <label>Color</label>
            <input value={infinityColour} onChange={event => {
                setInfinityColour(event.target.value)
            }}/>
            <p/>
            <label>Room State Read</label>
            <div>{JSON.stringify(roomState)}</div>
            <p/>
            <label>Room State Write</label>
            <input value={roomStateWrite} onChange={event => {
                setRoomStateWrite(event.target.value)
            }
            }/>
            <button onClick={() => {
                void changeRoomState(roomInput!, roomStateWrite! as RoomState);
            }}>Change Room State
            </button>
            <p/>
            <label>Player Playing</label>
            <div>{JSON.stringify(playerPlaying)}</div>
            <button onClick={() => {
                void changePlayerPlaying(roomInput!, infinityColour as InfinityStoneColor, !playerPlaying);
            }
            }>Toggle Player Playing
            </button>
            <p/>
            <button onClick={() => {
                void changePlayerScore(roomInput!, infinityColour as InfinityStoneColor, 1);
            }}>Change Score
            </button>
            <p/>
            <label>
                Player Total Score
            </label>
            <div>{totalScore}</div>
        </div>
    )
}

export default ThanasisTest;