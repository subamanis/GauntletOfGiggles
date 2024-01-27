import {FC, useEffect, useState} from "react";
import useMousePosition from "./mouse-position.ts";
import useMultiplayer from "./multiplayer/useMultiplayer.ts";
import {onValue, ref} from "firebase/database";
import {realTimeDatabase} from "./firebase/firebaseInit.ts";
import {InfinityRoom} from "./multiplayer/infinityTypes.ts";

interface MiniGame {
    id: number
    name: string;
    duration: number;
    score: number;
    evaluatorFn: () => void;
}

interface PetrosProps {
    roomId: string;
}

const Petros: FC<PetrosProps> = ({roomId}) => {
    const {useGetAvailablePlayersInRoom, joinRoom, changePlayerScore, changePlayerPlaying}
        = useMultiplayer();

    const [miniGames, setMiniGames] = useState<MiniGame[]>([
        {id: 1, name: "Giggle X Axis", duration: 3.0, score: 1, evaluatorFn: evaluateXAxisGiggleGame},
        {id: 2, name: "Giggle Y Axis", duration: 3.0, score: 1, evaluatorFn: evaluateYAxisGiggleGame},
        {id: 3, name: "Touch 2 Points", duration: 3.0, score: 1, evaluatorFn: evaluateTouch2PointsGame},
    ]);
    const [myInfinityRoom] = useState<InfinityRoom>({roomId});
    const [currentMiniGame, setCurrentMiniGame] = useState<MiniGame>(miniGames[0]);

    useEffect(() => {
        // const
        const availableStones = useGetAvailablePlayersInRoom(myInfinityRoom);
        const myStone = availableStones[0];
        const joinResult = joinRoom(myInfinityRoom, myStone);
        if (!joinResult) {
            //TODO: go back.
        }

        setCurrentMiniGame(chooseNextMiniGame());
        setInterval(() => {
            console.log('MiniGame change interval passed');
            setCurrentMiniGame(chooseNextMiniGame());
        }, 3000);

        const starCountRef = ref(realTimeDatabase, `sessions/1234`);

        // return onValue(starCountRef, (snapshot) => {
        //     console.log("petros")
        //     console.log(snapshot.val());
        //     setCount(snapshot.val().blue);
        // });

    }, []);

    const movement = useMousePosition(true);

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

    const evaluateXAxisGiggleGame = () => {

    }

    const evaluateYAxisGiggleGame = () => {

    }

    const evaluateTouch2PointsGame = () => {

    }

    return (
        <div style={{height: "100vh", width: "100vw", backgroundColor: "lightgray"}}>
            <h1>Petros</h1>
            <p>{movement.x} , {movement.y}</p>
        </div>
    )
}

export default Petros;