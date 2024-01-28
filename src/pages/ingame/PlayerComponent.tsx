import {FC, useEffect, useState} from "react";
import useMultiplayer from "../../multiplayer/useMultiplayer.ts";
import useMousePosition from "../../mouse-position.ts";
import useMouseTouch from "../../mouse-touch.ts";
import {InfinityStoneColor} from "../../multiplayer/infinityTypes.ts";
import {randomIntBetween} from "../../utils.ts";

enum MiniGameType {
    axisMovementX = 0,
    axisMovementY = 1,
    touchPoints2 = 2,
    touchPoints3 = 3,
}

const distanceToWin = 3500;
const maxAllowedDriftOffsetOnWrongAxis = 130;

interface PlayerComponentProps {
    roomId: string;
    infinityColor: InfinityStoneColor;
}

enum GemPosition {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
}

const gemToPosition = (gem: InfinityStoneColor): GemPosition => {
    switch (gem) {
        case "Yellow":
            return GemPosition.topLeft;
        case "Red":
            return GemPosition.bottomRight;
        case "Blue":
            return GemPosition.bottomLeft;
        case "Orange":
            return GemPosition.bottomRight;
        case "Green":
            return GemPosition.bottomLeft;
        case "Purple":
            return GemPosition.bottomRight;
    }
}

const gemPositionToCss = (gemPosition: GemPosition) => {
    switch (gemPosition) {
        case GemPosition.topLeft:
            return {
                width: 50, height: 50, left: 20, top: 70
            };
        case GemPosition.topRight:
            return {
                width: 50, height: 50, right: 20, top: 70
            };
        case GemPosition.bottomLeft:
            return {
                width: 50, height: 50, left: 20, bottom: 40
            };
        case GemPosition.bottomRight:
            return {
                width: 50, height: 50, right: 20, bottom: 40
            };
    }
}

const PlayerComponent: FC<PlayerComponentProps> = ({roomId, infinityColor}) => {
    const {useGetPlayerPlaying, changePlayerScore, changePlayerPlaying} = useMultiplayer()
    const isCurrentPlayerPlaying = useGetPlayerPlaying(roomId!, infinityColor);
    const mousePosition = useMousePosition();
    const mouseTouch = useMouseTouch();
    const [startingPosition, setStartingPosition] = useState<{ x: number | null, y: number | null }>({
        x: null,
        y: null
    });
    const [currentMiniGame] = useState(MiniGameType.axisMovementY);
    const [isFirstTouch, setIsFirstTouch] = useState(false);

    const [distanceForThisActionX, setDistanceForThisActionX] = useState<number>(0)
    const [distanceForThisActionY, setDistanceForThisActionY] = useState<number>(0)
    const [driftOffsetX, setDriftOffsetX] = useState<number>(0)
    // const [driftOffsetY, setDriftOffsetY] = useState<number>(0)
    const [playerLostReason, setPlayerLostReason] = useState<string | null>(null)
    const [wonThisRound, setWonThisRound] = useState(false);

    useEffect(() => {
        if (!isCurrentPlayerPlaying && mouseTouch.touches > 0) {
            if (!playerLostReason && !wonThisRound) {
                setPlayerLostReason("Touch while not playing" + Math.random());
            }
        }
    }, [isCurrentPlayerPlaying, mouseTouch.touches, playerLostReason, wonThisRound]);

    useEffect(() => {
        if (isCurrentPlayerPlaying) {
            playYourTurnSound();
            setDistanceForThisActionX(0);
            setDistanceForThisActionY(0);
        }
    }, [isCurrentPlayerPlaying]);

    useEffect(() => {
        if (isCurrentPlayerPlaying) {
            if (currentMiniGame === MiniGameType.axisMovementY) {
                // TODO do all mini game evaluations
                if (driftOffsetX > maxAllowedDriftOffsetOnWrongAxis && !playerLostReason && !wonThisRound) {
                    setPlayerLostReason("LOST from drift on X" + Math.random());
                }

                if (distanceForThisActionY > distanceToWin && !playerLostReason && !wonThisRound) {
                    setWonThisRound(true);
                    playLaughSound();
                }
            }
        }
    }, [isCurrentPlayerPlaying, distanceForThisActionX, distanceForThisActionY, currentMiniGame, driftOffsetX, playerLostReason, wonThisRound]);

    const resetPlayingState = () => {
        setPlayerLostReason(null);
        setWonThisRound(false);
        setDistanceForThisActionX(0);
        setDistanceForThisActionY(0);
    };

    useEffect(() => {
        if (mouseTouch.touches === 0) {
            setIsFirstTouch(false);
            setPlayerLostReason(null);

            if (!isCurrentPlayerPlaying) {
                resetPlayingState();
            }
        }

    }, [isCurrentPlayerPlaying, mouseTouch.touches]);

    useEffect(() => {
        if (wonThisRound) {
            console.log("Won this round: ", wonThisRound);
            // void changePlayerScore(roomId!, infinityColor, 3);
            void changePlayerPlaying(roomId!, infinityColor, false);
            // resetPlayingState();
        }
    }, [changePlayerPlaying, changePlayerScore, infinityColor, roomId, wonThisRound]);

    useEffect(() => {
        if (playerLostReason) {
            console.log("Player lost reason: ", playerLostReason);
            void changePlayerScore(roomId!, infinityColor, 1);
            void changePlayerPlaying(roomId!, infinityColor, false);
            // resetPlayingState();
        }
    }, [changePlayerScore, changePlayerPlaying, infinityColor, roomId, playerLostReason]);

    useEffect(() => {
        if (isFirstTouch && mouseTouch.x !== null && mouseTouch.y !== null) {
            setStartingPosition({x: mouseTouch.x, y: mouseTouch.y});
        }
    }, [mouseTouch.touches, mouseTouch, isFirstTouch]);

    useEffect(() => {
        if (mouseTouch.touches > 0 && !isFirstTouch) {
            setIsFirstTouch(true);
        }
    }, [isFirstTouch, mouseTouch.touches]);

    useEffect(() => {
        if (mouseTouch.touches > 0) {
            const distanceX = Math.abs(mousePosition.x - mousePosition.lastX);
            const distanceY = Math.abs(mousePosition.y - mousePosition.lastY);
            if (distanceX > 0) {
                setDistanceForThisActionX(prevState => prevState + distanceX);
                setDriftOffsetX(Math.abs(mousePosition.x - startingPosition.x!));
            }
            if (distanceY > 0) {
                setDistanceForThisActionY(prevState => prevState + distanceY);
                // setDriftOffsetY(Math.abs(mousePosition.y - startingPosition.y!));
            }
        }
    }, [mousePosition, mouseTouch.touches, startingPosition.x, startingPosition.y]);

    const playLaughSound = () => {
        const intRand = randomIntBetween(0,2);
        const audioEl = document.getElementsByClassName("audio-element")[intRand] as HTMLAudioElement;
        console.log('found audio element: ', audioEl);
        audioEl.play().then(r => console.log('promise resolve: '+r)).catch(e => console.error(e));
    }
    const playYourTurnSound = () => {
        // const audioEl = document.getElementsByClassName("audio-element-shining")[0] as HTMLAudioElement;
        // audioEl.play().then(r => console.log('promise resolve: '+r)).catch(e => console.error(e));
    }

    return <>
        <div>
            <div style={{
                ...gemPositionToCss(gemToPosition(infinityColor)),
                position: "fixed",
            }}>
                <img
                    style={{
                        height: "80px", width: "67px",
                    }}
                    src={`/gems/${infinityColor}Stone.png`}
                />
            </div>
        </div>
        <audio className="audio-element">
            <source src="/../../../public/sounds/laugh1.mp3"></source>
        </audio>
        <audio className="audio-element">
            <source src="/../../../public/sounds/laugh2.mp3"></source>
        </audio>
        <audio className="audio-element">
            <source src="/../../../public/sounds/laugh3.mp3"></source>
        </audio>
        <audio className="audio-element-shining">
            <source src="/../../../public/sounds/GemShining.mp3"></source>
        </audio>
        {/*<div style={{color: "white"}}>Score: {currentScore}</div>*/}
        {/*<div style={{color: "white"}}>Playing: {isCurrentPlayerPlaying ? "true" : "false"}</div>*/}
        {/*<div style={{color: "white"}}>Mouse X: {mousePosition.x}</div>*/}
        {/*<div style={{color: "white"}}>Mouse Y: {mousePosition.y}</div>*/}
        {/*<div style={{color: "white"}}>Mouse lastX: {mousePosition.lastX}</div>*/}
        {/*<div style={{color: "white"}}>Mouse lastY: {mousePosition.lastY}</div>*/}
        {/*<div style={{color: "white"}}>Mouse Touches : {mouseTouch.touches}</div>*/}
        {/*<div style={{color: "white"}}>Distance X : {distanceForThisActionX}</div>*/}
        {/*<div style={{color: "white"}}>Distance Y : {distanceForThisActionY}</div>*/}
        {/*<div style={{color: "white"}}>Starting X : {startingPosition.x}</div>*/}
        {/*<div style={{color: "white"}}>Starting Y : {startingPosition.y}</div>*/}
        {/*<div style={{color: "white"}}>Drift Offset X : {driftOffsetX}</div>*/}
        {/*<div style={{color: "white"}}>Drift Offset Y : {driftOffsetY}</div>*/}
        {/*<div style={{color: "yellow", fontSize: 22}}>Reason : {playerLostReason}</div>*/}

    </>
}

export default PlayerComponent;