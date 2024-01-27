import {FC} from "react";
import {useParams} from "react-router-dom";
import GamePageStyles from "./GamePage.module.css";

const GamePage: FC = () => {
    const {roomId, colorId} = useParams();

    return (
        <div className={GamePageStyles.ga}>
            <h1>Game Page</h1>
            <div>Room ID: {roomId}</div>
            <div>Color ID: {colorId}</div>
        </div>
    )
}

export default GamePage;