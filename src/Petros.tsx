import {FC, useEffect} from "react";
import useMousePosition from "./mouse-position.ts";

interface MiniGame {
    id: number
    name: string;
    duration: number;
    score: number;
}

const Petros: FC = () => {
    const movement = useMousePosition(true);

    const minigames: MiniGame[] = [
        {id: 1, name: "Giggle X Axis", duration: 3.0, score: 1},
        {id: 2, name: "Giggle Y Axis", duration: 3.0, score: 1},
        {id: 3, name: "Touch 2 Points", duration: 3.0, score: 1},
    ]
    const currentMiniGame: MiniGame = minigames[0];

    // const minigames:

    useEffect(() => {

    }, []);

    const chooseNextMinigame = () => {
        if (currentMiniGame.id === minigames[0].id) {
            currentMiniGame = minigames[1];
        } else {
            currentMiniGame = minigames[0];
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