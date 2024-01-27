import {FC, useEffect, useMemo, useState} from "react";
import useMousePosition from "./mouse-position.ts";
import useMultiplayer from "./multiplayer/useMultiplayer.ts";
import {InfinityRoom, InfinityStoneColor} from "./multiplayer/infinityTypes.ts";
import { useParams } from "react-router";

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
    evaluatorFn: (movement: Movement) => MiniGameState;
}

const Petros = () => {
    const {sessionId, colorId} = useParams();
    const roomId = useMemo(() => sessionId as string , [sessionId]);
    const myStoneColor = useMemo(() => colorId as InfinityStoneColor , [colorId]);

    const {useGetAvailablePlayersInRoom, joinRoom, useGetPlayerPlaying, changePlayerScore, changePlayerPlaying}
        = useMultiplayer();

    const evaluateXAxisGiggleGame = (movement: Movement): MiniGameState => {
        if (movement.x > movement.lastX) {
            console.log("right");
        } else if (movement.x < movement.lastX) {
            console.log("left");
        }
        return MiniGameState.PLAYING;
    }

    const evaluateYAxisGiggleGame = (movement: Movement): MiniGameState => {
        if (movement.y > movement.lastY) {
            console.log("up");
        } else if (movement.y < movement.lastY) {
            console.log("down");
        }
        return MiniGameState.PLAYING;
    }

    const evaluateTouch2PointsGame = (movement: Movement): MiniGameState => {
        return MiniGameState.PLAYING;
    }

    const [miniGames, setMiniGames] = useState<MiniGame[]>([
        {id: 1, name: "Giggle X Axis", duration: 3.0, score: 1, evaluatorFn: evaluateXAxisGiggleGame},
        {id: 2, name: "Giggle Y Axis", duration: 3.0, score: 1, evaluatorFn: evaluateYAxisGiggleGame},
        {id: 3, name: "Touch 2 Points", duration: 3.0, score: 1, evaluatorFn: evaluateTouch2PointsGame},
    ]);
    //Remove these when move
    const [myInfinityRoom] = useState<InfinityRoom>({roomId});
    const [myStone] = useState<InfinityStoneColor>();
    const [currentMiniGame, setCurrentMiniGame] = useState<MiniGame>(miniGames[0]);
    // const [amIPlayingNow, setAmIPlayingNow] = useState<boolean>(false);

    useEffect(() => {
        setCurrentMiniGame(chooseNextMiniGame());
        setInterval(() => {
            console.log('MiniGame change interval passed');
            setCurrentMiniGame(chooseNextMiniGame());
        }, 4000);
    }, []);

    const amIPlayingNow = useGetPlayerPlaying(myInfinityRoom, myStoneColor);
    const movement = useMousePosition(true);
    currentMiniGame.evaluatorFn(movement);

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