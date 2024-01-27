import {FC, useMemo, useState} from "react";
import classnames from "classnames";
import GlobalStyles from "../src/assets/css/GlobalStyles.module.css"
import useMultiplayer from "./multiplayer/useMultiplayer.ts";
import {InfinityRoom, InfinityStoneColor, RoomState} from "./multiplayer/infinityTypes.ts";

const ThanasisTest: FC = () => {
    const [roomInput, setRoomInput] = useState<string>();
    const [infinityColour, setInfinityColour] = useState<string>();
    const [roomStateWrite, setRoomStateWrite] = useState<string>();
    const infinityRoom = useMemo<InfinityRoom>(() => {
        return {
            roomId: roomInput!,
        }
    }, [roomInput]);

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
    const roomState = useGetRoomState(infinityRoom);
    const playerPlaying = useGetPlayerPlaying(infinityRoom, infinityColour as InfinityStoneColor);
    const totalScore = useGetPlayersScore(infinityRoom);
    const availablePlayersInRoom = useGetAvailablePlayersInRoom(infinityRoom);

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
                void changeRoomState(infinityRoom, roomStateWrite! as RoomState);
            }}>Change Room State
            </button>
            <p/>
            <label>Player Playing</label>
            <div>{JSON.stringify(playerPlaying)}</div>
            <button onClick={() => {
                void changePlayerPlaying(infinityRoom, infinityColour as InfinityStoneColor, !playerPlaying);
            }
            }>Toggle Player Playing
            </button>
            <p/>
            <button onClick={() => {
                void changePlayerScore(infinityRoom, infinityColour as InfinityStoneColor, 1);
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