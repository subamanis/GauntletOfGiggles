import {FC, useEffect, useMemo} from "react";
import {useParams} from "react-router-dom";
import GamePageStyles from "./GamePage.module.css";
import classnames from "classnames";
import {InfinityStoneColor} from "../../multiplayer/infinityTypes.ts";
import ServerComponent from "./ServerComponent.tsx";
import PlayerComponent from "./PlayerComponent.tsx";
import useMultiplayer from "../../multiplayer/useMultiplayer.ts";
import thanos0 from "../../../public/thanos/Thanos0.png";
import thanos1 from "../../../public/thanos/Thanos1.png";
import thanos2 from "../../../public/thanos/Thanos2.png";
import thanos3 from "../../../public/thanos/Thanos3.png";
import thanos4 from "../../../public/thanos/Thanos4.png";


const GamePage: FC = () => {
    const {roomId, colorId} = useParams();
    const infinityColor = useMemo(
        () => colorId as InfinityStoneColor,
        [colorId]);
    // const imageName = "Thanos";
    const backgroundSize: string = useMemo(() => {
        return infinityColor === "Yellow" ? "120% 120%"
            : infinityColor === "Red" || infinityColor === "Blue" || infinityColor === "Orange" ? "200% 200%"
                : "250% 250%"
    }, [infinityColor])

    const {useGetPlayersScore} = useMultiplayer();
    const playersScore = useGetPlayersScore(roomId!);
    const currentThanosImg = useMemo(() => {
        if(infinityColor !== "Yellow") {
            return thanos1;
        }
        if (playersScore > -5 && playersScore < 40) {
            return thanos1; //normal
        } else if (playersScore <= -5) {
            return thanos0; // angry
        } else if (playersScore <= 180) {
            return thanos2; // happy
        } else if (playersScore <= 350) {
            return thanos3; // very happy
        }
        return thanos4; // super happy

    }, [playersScore]);

    // useEffect(() => {
    //     const image = new Image();
    //     image.src = `url(/thanos/Thanos0.png)`;
    //     image.src = `url(/thanos/Thanos1.png)`;
    //     image.src = `url(/thanos/Thanos2.png)`;
    //     image.src = `url(/thanos/Thanos3.png)`;
    //     image.src = `url(/thanos/Thanos4.png)`;
    // }, []);


    const backgroundPosition: string = useMemo(() => {
        return infinityColor === "Red" ? "105% 60%"
            : infinityColor === "Blue" ? "15% 75%"
                : infinityColor === "Orange" ? "75% 60%"
                    : infinityColor === "Green" ? "52% 100%"
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
                // backgroundImage: `url("/thanos/${imageName}${imageToUse}.png")`,
                backgroundImage: `url(${currentThanosImg})`,
                backgroundColor: "rgb(142, 86, 177)",
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