import {FC} from "react";
import {useParams} from "react-router-dom";
import GamePageStyles from "./GamePage.module.css";
import GlobalStyles from "./../../assets/css/GlobalStyles.module.css"
import classnames from "classnames";
import {GemToImageMap, InfinityStoneColor} from "../../multiplayer/infinityTypes.ts";

const GamePage: FC = () => {
    const {roomId, colorId} = useParams();
    const imageName = GemToImageMap[colorId as InfinityStoneColor];

    return (
        <div className={classnames(GamePageStyles.gamePage, GlobalStyles.flex1, GlobalStyles.flex)}>
            <div className={classnames(GamePageStyles.gamePage, GlobalStyles.flex1)} style={{
                backgroundSize: "cover",
                backgroundPositionX: "center",
                backgroundImage:
                    `url("${`/thanos/${imageName}.png`}")`}}>
                <div style={{color:"white"}}>Room ID: {roomId}</div>
                <div style={{color:"white"}}>Color ID: {colorId}</div>
            </div>
        </div>
    )
}

export default GamePage;