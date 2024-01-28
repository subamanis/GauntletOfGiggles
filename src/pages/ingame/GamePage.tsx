import {FC, useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import GamePageStyles from "./GamePage.module.css";
import GlobalStyles from "./../../assets/css/GlobalStyles.module.css"
import classnames from "classnames";
import {GemToImageMap, InfinityStoneColor} from "../../multiplayer/infinityTypes.ts";
import ServerComponent from "./ServerComponent.tsx";
import PlayerComponent from "./PlayerComponent.tsx";
import useMultiplayer from "../../multiplayer/useMultiplayer.ts";


const GamePage: FC = () => {
    const {roomId, colorId} = useParams();
    const infinityColor = useMemo(
        () => colorId as InfinityStoneColor,
        [colorId]);
    const imageName = "Thanos";
    const backgroundSize: string = useMemo(() => {
        return infinityColor === "Yellow" ? "120% 120%"
            : infinityColor === "Red" || infinityColor === "Blue" || infinityColor === "Orange" ? "200% 200%"
                : "250% 250%"
    }, [infinityColor])

    const {useGetPlayersScore} = useMultiplayer();
    const playersScore = useGetPlayersScore(roomId!);
    const imageToUse = useMemo(() => {
        if(infinityColor !== "Yellow") {
            return 1;
        }
        if (playersScore > -5 && playersScore < 5) {
            return 1; //normal
        } else if (playersScore <= -5) {
            return 0; // angry
        } else if (playersScore <= 10) {
            return 2; // happy
        } else if (playersScore <= 20) {
            return 3; // very happy
        }
        return 4; // super happy

    }, [playersScore]);

    useEffect(() => {
        const image = new Image();
        image.src = `url(/thanos/Thanos0.png)`;
        image.src = `url(/thanos/Thanos1.png)`;
        image.src = `url(/thanos/Thanos2.png)`;
        image.src = `url(/thanos/Thanos3.png)`;
        image.src = `url(/thanos/Thanos4.png)`;
    }, []);


    const backgroundPosition: string = useMemo(() => {
        return infinityColor === "Red" ? "85% 75%"
            : infinityColor === "Blue" ? "15% 75%"
                : infinityColor === "Orange" ? "75% 50%"
                    : infinityColor === "Green" ? "55% 100%"
                        : infinityColor === "Purple" ? "85% 100%"
                            : "100% 10%"
    }, [infinityColor])
    console.log("lianos", backgroundPosition)
    return (
        <div className={classnames(GamePageStyles.gamePage)}>
            <div className={classnames(GamePageStyles.gamePage)} style={{
                aspectRatio: 1,
                // width: "100%",
                height: "100%",
                backgroundImage: `url("/thanos/${imageName}${imageToUse}.png")`,
                backgroundSize: backgroundSize,
                backgroundPosition: backgroundPosition,
                backgroundRepeat: "no-repeat",
                // backgroundPositionX: "center",
            }}>
                <div style={{color: "white"}}>Room ID: {roomId}</div>
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