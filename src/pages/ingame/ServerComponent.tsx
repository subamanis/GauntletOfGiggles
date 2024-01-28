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
    const {useGetPlayersScore, useGetPlayersPlaying, useGetRoomState, changePlayerScore,
        changePlayerPlaying, useGetAvailablePlayersInRoom, changeRoomState}
        = useMultiplayer();
    const currentScore = useGetPlayersScore(roomId);
    const playersPlaying = useGetPlayersPlaying(roomId);
    const availablePlayersInRoom = useGetAvailablePlayersInRoom(roomId);
    const currentRoomState = useGetRoomState(roomId);
    const availablePlayersInRoomRef = useRef(availablePlayersInRoom);
    const playersPlayingRef = useRef(playersPlaying);
    const timeForRoundMs = 3000;

    const chooseNextPlayer = () => {
        let notFoundPlayer = true;
        let chosenPlayer: InfinityStoneColor | null = null;
        while (notFoundPlayer) {
            const notPlayingPlayers = infinityStoneColorsInArray
                .filter(color => !playersPlaying.includes(color) && !availablePlayersInRoomRef.current.includes(color));
            if (notPlayingPlayers.length === 0) {
                return;
            }

            const randomInt = randomIntBetween(0, notPlayingPlayers.length - 1);
            chosenPlayer = infinityStoneColorsInArray[randomInt]
            if (chosenPlayer.toLowerCase() === 'yellow'/*mind stone - server*/) {
                continue;
            }
            notFoundPlayer = false;
            console.log('playing players (currently lit stones): ',playersPlaying);
            console.log('notPlayingPlayers (in room but not lit): '+notPlayingPlayers);
        }

        changePlayerPlaying(roomId, chosenPlayer!, true).then(() => {
            console.log('Chosen player changed to '+chosenPlayer);
        });

        setTimeout((chosenPlayer: InfinityStoneColor) => {
            console.log('Stopping player round: '+chosenPlayer);
            if (playersPlayingRef.current.includes(chosenPlayer)) {
                changePlayerScore(roomId, chosenPlayer, -1).then(() => {
                    console.log('Removed 1 point from '+chosenPlayer);
                });
            }
            changePlayerPlaying(roomId, chosenPlayer, false).then(() => {
                console.log(chosenPlayer+' player not playing any more');
            });
        }, timeForRoundMs, chosenPlayer);
    }

    const startTimeoutToSelectNextPlayer = () => {
        if (currentRoomState === RoomState.InProgress) {
            const timeoutDuration = randomIntBetween(500, 4000);
            console.log('Timeout ms chosen: '+timeoutDuration);
            setTimeout(() => {
                chooseNextPlayer();
                startTimeoutToSelectNextPlayer();
            }, timeoutDuration);
        }
    }

    const startTimeoutForRoundEnd = () => {
        setTimeout(() => {
            changeRoomState(roomId, RoomState.FinishedFailure).then(() => {
                console.log('Room state changed to finished failure');
            }).catch(() => {
                console.log('error while failing');
            });
        },60000);
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
            startTimeoutForRoundEnd();
        }
    }, [currentRoomState]);
    useEffect(() => {
        if (currentScore > 30) {
            console.log('YOU WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOON');
        } else if (currentScore < 30) {
            console.log('LOSE LOSE LOSE LOSE LOSE LOSE LOSE LOSE LOSE');
        }
    }, [currentScore]);
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