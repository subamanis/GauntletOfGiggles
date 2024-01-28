import {FC, useEffect, useRef} from "react";
import useMultiplayer from "../../multiplayer/useMultiplayer.ts";
import {InfinityStoneColor, infinityStoneColorsInArray, RoomState} from "../../multiplayer/infinityTypes.ts";
import {randomIntBetween} from "../../utils.ts";
import classnames from "classnames";
import GlobalStyles from "./../../assets/css/GlobalStyles.module.css"
import greenGem from "../../../public/gems/GreenStone.png"
import orangeGem from "../../../public/gems/OrangeStone.png"
import redGem from "../../../public/gems/RedStone.png"
import purpleGem from "../../../public/gems/PurpleStone.png"
import blueGem from "../../../public/gems/BlueStone.png"

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
        // setTimeout(() => {
        //     changeRoomState(roomId, RoomState.FinishedFailure).then(() => {
        //         console.log('Room state changed to finished failure');
        //     }).catch(() => {
        //         console.log('error while failing');
        //     });
        // },60000);
    }

    const makeRoomStartPlaying = () => {
        changeRoomState(roomId, RoomState.InProgress).then(() => {
            console.log('Room state changed to playing');
        }).catch(() => {
            console.log('Error changing room state to playing');
        });
    }

    const playLoseSound = () => {
        const audioEl = document.getElementsByClassName("audio-element-inevitable")[0] as HTMLAudioElement;
        audioEl.play().then(r => console.log('promise resolve: '+r)).catch(e => console.error(e));
    }
    const playStartGameSound = () => {
        const audioEl = document.getElementsByClassName("audio-element-near")[0] as HTMLAudioElement;
        audioEl.play().then(r => console.log('promise resolve: '+r)).catch(e => console.error(e));
    }

    const colorToStoneMap: Map<InfinityStoneColor, string> = new Map([
        ["Green", greenGem],
        ["Orange", orangeGem],
        ["Red", redGem],
        ["Purple", purpleGem],
        ["Blue", blueGem],
    ]);

    useEffect(() => {
        console.log("ServerComponent mounted");
        console.log('rand: ', randomIntBetween(0, 6));
    }, []);
    useEffect(() => {
        if (currentRoomState === RoomState.InProgress) {
            startTimeoutToSelectNextPlayer();
            startTimeoutForRoundEnd();
            playStartGameSound();
        }
    }, [currentRoomState]);
    useEffect(() => {
        if (currentScore > 30) {
            console.log('YOU WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOON');
        } else if (currentScore < 30) {
            console.log('LOSE LOSE LOSE LOSE LOSE LOSE LOSE LOSE LOSE');
            playLoseSound();
        }
    }, [currentScore]);
    useEffect(() => {
        availablePlayersInRoomRef.current = availablePlayersInRoom;
    }, [availablePlayersInRoom]);
    useEffect(() => {
        playersPlayingRef.current = playersPlaying;
    }, [playersPlaying]);

    return <>
        <div className={(classnames(GlobalStyles.flex,GlobalStyles.flex1,))}>
        {/*<div style={{color: "white"}}>Game Score: {currentScore}</div>*/}
        {/*<div style={{color: "yellow"}}>Server Page</div>*/}
            {currentRoomState === RoomState.WaitingForPlayers && <button onClick={makeRoomStartPlaying}>Start playing</button>}
        <audio className="audio-element-inevitable">
            <source src="/../../../public/sounds/IAmInevitable.mp3"></source>
        </audio>
        <audio className="audio-element-near">
            <source src="/../../../public/sounds/TheEndIsNear.mp3"></source>
        </audio>
            <div className={(classnames(GlobalStyles.flex1))}/>
            <div className={(classnames(GlobalStyles.flex, GlobalStyles.gap))}>
                {infinityStoneColorsInArray.filter(stone => stone !== "Yellow").map((color) =>
                    <div key={color}>
                        {(currentRoomState === RoomState.WaitingForPlayers && !availablePlayersInRoom.includes(color) ||
                            (currentRoomState !== RoomState.WaitingForPlayers && playersPlaying.includes(color))) ?
                            <img src={colorToStoneMap.get(color)} alt="" style={{height: "5em"}}/> :
                            <div  style={{width: "5em"}}/>}
                    </div>
                )}
            </div>

        </div>
    </>
}

export default ServerComponent;