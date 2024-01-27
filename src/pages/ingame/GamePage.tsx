import {FC, useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import GamePageStyles from "./GamePage.module.css";
import GlobalStyles from "./../../assets/css/GlobalStyles.module.css"
import classnames from "classnames";
import {GemToImageMap, InfinityStoneColor} from "../../multiplayer/infinityTypes.ts";
import ServerComponent from "./ServerComponent.tsx";
import PlayerComponent from "./PlayerComponent.tsx";


const GamePage: FC = () => {
    const {roomId, colorId} = useParams();
    const infinityColor = useMemo(
        () => colorId as InfinityStoneColor,
        [colorId]);
    const imageName = GemToImageMap[infinityColor];

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
                {
                    infinityColor === "Yellow" ? <ServerComponent roomId={roomId!}/> :
                        <PlayerComponent roomId={roomId!} infinityColor={infinityColor}/>
                }
            </div>
        </div>
    )
}

export default GamePage;