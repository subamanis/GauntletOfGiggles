import {FC, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import GamePageStyles from "./GamePage.module.css";
import GlobalStyles from "./../../assets/css/GlobalStyles.module.css"
import classnames from "classnames";
import {GemToImageMap, InfinityStoneColor} from "../../multiplayer/infinityTypes.ts";
import useMultiplayer from "../../multiplayer/useMultiplayer.ts";
import useMousePosition from "../../mouse-position.ts";
import useMouseTouch from "../../mouse-touch.ts";

enum MiniGameType {
    axisMovementX,
    axisMovementY,
    touchPoints2,
    touchPoints3,
}

const distanceToWin = 3500;
const maxAllowedDriftOffsetOnWrongAxis = 130;

const GamePage: FC = () => {
    const {roomId, colorId} = useParams();
    const infinityColor = colorId as InfinityStoneColor;
    const imageName = GemToImageMap[infinityColor];
    const {useGetPlayersScore, useGetPlayerPlaying} = useMultiplayer()
    const currentScore = useGetPlayersScore(roomId!);
    const isCurrentPlayerPlaying = useGetPlayerPlaying(roomId!, infinityColor);
    const mousePosition = useMousePosition();
    const mouseTouch = useMouseTouch();
    const [startingPosition, setStartingPosition] = useState<{ x: number | null, y: number | null }>({
        x: null,
        y: null
    });
    const [currentMiniGame, setCurrentMiniGame] = useState(MiniGameType.axisMovementY);
    const [isFirstTouch, setIsFirstTouch] = useState(false);

    useEffect(() => {
        if (!isCurrentPlayerPlaying && mouseTouch.touches > 0) {
            console.log("LOST");
        }
    }, [isCurrentPlayerPlaying, mouseTouch.touches]);

    const [distanceForThisActionX, setDistanceForThisActionX] = useState<number>(0)
    const [distanceForThisActionY, setDistanceForThisActionY] = useState<number>(0)
    const [driftOffsetX, setDriftOffsetX] = useState<number>(0)
    const [driftOffsetY, setDriftOffsetY] = useState<number>(0)

    useEffect(() => {
        if (isCurrentPlayerPlaying) {
            setDistanceForThisActionX(0);
            setDistanceForThisActionY(0);
        }
    }, [isCurrentPlayerPlaying]);

    useEffect(() => {
        if (isCurrentPlayerPlaying) {
            if (currentMiniGame === MiniGameType.axisMovementY) {
                if (driftOffsetX > maxAllowedDriftOffsetOnWrongAxis) {
                    console.log("LOST from drift on X");
                }

                if (distanceForThisActionY > distanceToWin) {
                    console.log("WON on Y");
                }
            }
        }
    }, [isCurrentPlayerPlaying, distanceForThisActionX, distanceForThisActionY, currentMiniGame]);

    useEffect(() => {
        if (mouseTouch.touches === 0) {
            setIsFirstTouch(false);

            if (!isCurrentPlayerPlaying) {
                setDistanceForThisActionX(0);
                setDistanceForThisActionY(0);
            }
        }

    }, [isCurrentPlayerPlaying, mouseTouch.touches]);

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
                setDriftOffsetY(Math.abs(mousePosition.y - startingPosition.y!));
            }
        }
    }, [mousePosition, mouseTouch.touches, startingPosition.x, startingPosition.y]);

    return (
        <div className={classnames(GamePageStyles.gamePage, GlobalStyles.flex1, GlobalStyles.flex)}>
            <div className={classnames(GamePageStyles.gamePage, GlobalStyles.flex1)} style={{
                backgroundSize: "cover",
                backgroundPositionX: "center",
                backgroundImage:
                    `url("/thanos/${imageName}.png")`
            }}>
                <div style={{color: "white"}}>Room ID: {roomId}</div>
                <div style={{color: "white"}}>Color ID: {colorId}</div>
                <div style={{color: "white"}}>Score: {currentScore}</div>
                <div style={{color: "white"}}>Playing: {isCurrentPlayerPlaying ? "true" : "false"}</div>
                <div style={{color: "white"}}>Mouse X: {mousePosition.x}</div>
                <div style={{color: "white"}}>Mouse Y: {mousePosition.y}</div>
                <div style={{color: "white"}}>Mouse lastX: {mousePosition.lastX}</div>
                <div style={{color: "white"}}>Mouse lastY: {mousePosition.lastY}</div>
                <div style={{color: "white"}}>Mouse Touches : {mouseTouch.touches}</div>
                <div style={{color: "white"}}>Distance X : {distanceForThisActionX}</div>
                <div style={{color: "white"}}>Distance Y : {distanceForThisActionY}</div>
                <div style={{color: "white"}}>Starting X : {startingPosition.x}</div>
                <div style={{color: "white"}}>Starting Y : {startingPosition.y}</div>
                <div style={{color: "white"}}>Drift Offset X : {driftOffsetX}</div>
                <div style={{color: "white"}}>Drift Offset Y : {driftOffsetY}</div>
            </div>
        </div>
    )
}

export default GamePage;