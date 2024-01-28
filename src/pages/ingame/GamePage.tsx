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
    const imageName = "ThanosCartoon";
    const backgroundSize: string = useMemo(() => {
        return infinityColor === "Yellow" ? "120% 120%" 
        : infinityColor === "Red" || infinityColor === "Blue" || infinityColor === "Orange" ? "200% 200%"
        : "250% 250%" 
    }, [infinityColor])

    const backgroundPosition: string = useMemo(() => {
        return infinityColor === "Red" ? "85% 75%" 
        : infinityColor === "Blue" ? "15% 75%" 
        : infinityColor === "Orange" ? "75% 50%" 
        : infinityColor === "Green" ? "55% 100%" 
        : infinityColor === "Purple" ? "85% 100%" 
        : "205% 10%" 
    }, [infinityColor])
console.log("lianos", backgroundPosition)
    return (
        <div className={classnames(GamePageStyles.gamePage)}>
            <div className={classnames(GamePageStyles.gamePage)} style={{
                aspectRatio: 1,
                // width: "100%",
                height: "100%",
                backgroundImage: `url("/thanos/${imageName}.jpg")`,
                backgroundSize: backgroundSize,
                backgroundPosition: backgroundPosition,
                backgroundRepeat: "no-repeat",
                // backgroundPositionX: "center",
            }}>
                <div style={{color: "white"}}>Room ID: {roomId}</div>
                <div style={{color: "white"}}>Color ID: {colorId}</div>
                {
                    infinityColor === "Yellow" ? <ServerComponent roomId={roomId!}/> :
                        <PlayerComponent roomId={roomId!} infinityColor={infinityColor}/>
                }
                {/* <div className={classnames(GamePageStyles.glowingGemRed)}/>
                <div className={classnames(GamePageStyles.glowingGemGreen)}/>
                <div className={classnames(GamePageStyles.glowingGemPurple)}/>
                <div className={classnames(GamePageStyles.glowingGemBlue)}/>
                <div className={classnames(GamePageStyles.glowingGemOrange)}/> */}
            </div>
        </div>
    )
}

export default GamePage;