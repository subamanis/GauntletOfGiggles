import {FC, useCallback, useEffect, useMemo, useState} from "react";
import useMousePosition from "./mouse-position.ts";
import useMultiplayer from "./multiplayer/useMultiplayer.ts";
import {InfinityRoom, InfinityStoneColor} from "./multiplayer/infinityTypes.ts";
import { useParams } from "react-router";
import useMouseTouch from "./mouse-touch.ts";

interface Movement {
    x: number;
    y: number;
    lastX: number;
    lastY: number;
}

enum MiniGameState {
    PLAYING = 0,
    WON = 1,
    LOST = 2
}

interface MiniGame {
    id: number
    name: string;
    duration: number;
    score: number;
    evaluatorFn: () => MiniGameState;
}

const Petros = () => {
    const {sessionId, colorId} = useParams();
    const roomId = useMemo(() => sessionId as string , [sessionId]);
    const myStoneColor = useMemo(() => colorId as InfinityStoneColor , [colorId]);

    const {useGetAvailablePlayersInRoom, joinRoom, useGetPlayerPlaying, changePlayerScore, changePlayerPlaying}
        = useMultiplayer();

    const finishMiniGame = (miniGame: MiniGame, hasWon: boolean) => {
        const a = changePlayerPlaying(myInfinityRoom, myStoneColor, false).then(() => {
            console.log('Player is not playing anymore');
        }).catch(() => {
            console.error('Error updating is playing');
        });

        changePlayerScore(myInfinityRoom, myStoneColor, currentMiniGame.score).then(() => {
            console.log('Player updated score by ', currentMiniGame.score);
        }).catch(() => {
            console.error('Error updating score');
        });

        resetState();
    }

    const resetState = () => {
        setDistanceX(0);
        setDistanceY(0);
        setFirstTouchCoordinates({x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER});
        if (!timeoutObj) {
            console.error('This should not happen, clearing undefined timeout');
        } else {
            clearTimeout(timeoutObj);
        }
    }

    const evaluateXAxisGiggleGame = () => {
        if (touch.isTouching && !isPlaying) {
            return finishMiniGame(currentMiniGame, false);
            //should not continue (reset state too)
        }

        if (firstTouchCoordinates.x === Number.MAX_SAFE_INTEGER) {
            setFirstTouchCoordinates({x: movement.x, y: movement.y});
        }

        setDistanceX(distanceX + Math.abs(movement.x - movement.lastX));
        console.log('Distance X: ', distanceX);
        if (Math.abs(movement.y - firstTouchCoordinates.y) > maxAllowedDriftOffsetOnWrongAxis) {
            return finishMiniGame(currentMiniGame, false);
        }
    }

    const evaluateYAxisGiggleGame = (): MiniGameState => {
        if (movement.y > movement.lastY) {
            console.log("up");
        } else if (movement.y < movement.lastY) {
            console.log("down");
        }
        return MiniGameState.PLAYING;
    }

    const evaluateTouch2PointsGame = (): MiniGameState => {
        return MiniGameState.PLAYING;
    }

    const [miniGames, setMiniGames] = useState<MiniGame[]>([
        {id: 1, name: "Giggle X Axis", duration: 3.0, score: 1, evaluatorFn: evaluateXAxisGiggleGame},
        {id: 2, name: "Giggle Y Axis", duration: 3.0, score: 1, evaluatorFn: evaluateYAxisGiggleGame},
        {id: 3, name: "Touch 2 Points", duration: 3.0, score: 1, evaluatorFn: evaluateTouch2PointsGame},
    ]);
    //Remove these when move
    const [timeoutObj, setTimeoutObj] = useState<NodeJS.Timeout | undefined>(undefined);
    const [firstTouchCoordinates, setFirstTouchCoordinates]
        = useState<{ x: number, y: number }>({x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER});
    const [maxGiggleDistanceToWin] = useState<number>(200);
    const [maxAllowedDriftOffsetOnWrongAxis] = useState<number>(20);
    const [distanceX, setDistanceX] = useState<number>(0);
    const [distanceY, setDistanceY] = useState<number>(0);
    const [myInfinityRoom] = useState<InfinityRoom>({roomId});
    const [myStone] = useState<InfinityStoneColor>();
    const [currentMiniGame, setCurrentMiniGame] = useState<MiniGame>(miniGames[0]);

    const startChangingMiniGameAtInterval = () => {
        setTimeout(() => {
            setCurrentMiniGame(chooseNextMiniGame());
            console.log('currentMiniGame changed to: ', currentMiniGame);
            startChangingMiniGameAtInterval();
        }, 4000);
    }

    useEffect(() => {
        setCurrentMiniGame(chooseNextMiniGame());
        startChangingMiniGameAtInterval();
    }, []);

    const isPlaying = useGetPlayerPlaying(myInfinityRoom, myStoneColor);
    if (isPlaying) {
        setTimeoutObj(setTimeout(() => {
            finishMiniGame(currentMiniGame, false);
        }, 3000));
    }
    const movement = useMousePosition();
    const touch = useMouseTouch();

    useEffect(() => {
        if (touch.isTouching && !isPlaying) {
            finishMiniGame(currentMiniGame, false);
            //should not continue (reset state too)
        } else {
            currentMiniGame.evaluatorFn();
        }

    }, [touch.isTouching, isPlaying, movement]);

    const chooseNextMiniGame = () : MiniGame => {
        // placeholder, pick x or y giggles only
        if (currentMiniGame.id === miniGames[0].id) {
            console.log('MiniGame "Giggle Y Axis" chosen');
            return miniGames[1];
        } else {
            console.log('MiniGame "Giggle X Axis" chosen');
            return miniGames[0];
        }
    }

    const minigameTimeoutResolved = () => {
        console.log("yolo");
    }

    return (
        <div style={{height: "100vh", width: "100vw", backgroundColor: "lightgray"}}>
            <h1>Petros</h1>
            <p>{movement.x} , {movement.y}</p>
        </div>
    )
}

export default Petros;