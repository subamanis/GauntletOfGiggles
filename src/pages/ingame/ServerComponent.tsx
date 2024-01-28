import {FC, useEffect, useRef} from "react";
import useMultiplayer from "../../multiplayer/useMultiplayer.ts";
import {
    GemToImageMap,
    InfinityStoneColor,
    infinityStoneColorsInArray,
    RoomState
} from "../../multiplayer/infinityTypes.ts";
import {randomIntBetween} from "../../utils.ts";


interface ServerComponentProps {
    roomId: string;
}

const ServerComponent: FC<ServerComponentProps> = ({roomId}) => {
    const {useGetPlayersScore, useGetPlayersPlaying, useGetRoomState,
        changePlayerPlaying, useGetAvailablePlayersInRoom, changeRoomState}
        = useMultiplayer();
    const currentScore = useGetPlayersScore(roomId);
    const playersPlaying = useGetPlayersPlaying(roomId);
    const availablePlayersInRoom = useGetAvailablePlayersInRoom(roomId);
    const currentRoomState = useGetRoomState(roomId);
    const availablePlayersInRoomRef = useRef(availablePlayersInRoom);
    const playersPlayingRef = useRef(playersPlaying);

    const chooseNextPlayer = () => {
        let notFoundPlayer = true;
        let chosenPlayer: InfinityStoneColor | null = null;
        while (notFoundPlayer) {
            console.log('available players: ', availablePlayersInRoomRef.current);
            console.log('playing players: ',playersPlaying);

            const notPlayingPlayers = infinityStoneColorsInArray
                .filter(color => !playersPlaying.includes(color) && !availablePlayersInRoomRef.current.includes(color));
            console.log('notPlayingPlayers players: '+notPlayingPlayers);
            if (notPlayingPlayers.length === 0) {
                return;
            }

            console.log('max rand: '+(notPlayingPlayers.length - 1));
            const randomInt = randomIntBetween(0, notPlayingPlayers.length - 1);
            console.log('randomInt: '+randomInt);
            chosenPlayer = infinityStoneColorsInArray[randomInt]
            if (chosenPlayer.toLowerCase() === 'yellow'/*mind stone - server*/) {
                continue;
            }
            notFoundPlayer = false;
        }
        changePlayerPlaying(roomId, chosenPlayer!, true).then(() => {
            console.log('Chosen player changed to '+chosenPlayer);
        }).catch(() => {
            console.log('Error changing chosen player');
        });
    }

    const startTimeoutToSelectNextPlayer = () => {
        const timeoutDuration = randomIntBetween(500, 4000);
        console.log('Timeout ms chosen: '+timeoutDuration);
        setTimeout(() => {
            chooseNextPlayer();
            startTimeoutToSelectNextPlayer();
        }, timeoutDuration);
    }

    const makeRoomStartPlaying = () => {
        changeRoomState(roomId, RoomState.InProgress).then(() => {
            console.log('Room state changed to playing');
        }).catch(() => {
            console.log('Error changing room state to playing');
        });
    }

    useEffect(() => {
        console.log("ServerComponent mounted");
        console.log('rand: ', randomIntBetween(0, 6));
    }, []);
    useEffect(() => {
        if (currentRoomState === RoomState.InProgress) {
            startTimeoutToSelectNextPlayer();
        }
    }, [currentRoomState]);
    useEffect(() => {
        availablePlayersInRoomRef.current = availablePlayersInRoom;
    }, [availablePlayersInRoom]);
    useEffect(() => {
        playersPlayingRef.current = playersPlaying;
    }, [playersPlaying]);

    return <>
        <div style={{color: "white"}}>Game Score: {currentScore}</div>
        <div style={{color: "yellow"}}>Server Page</div>
        <button onClick={makeRoomStartPlaying}>Start playing</button>
    </>
}

export default ServerComponent;