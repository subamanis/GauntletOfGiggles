import {FC} from "react";
import useMultiplayer from "../../multiplayer/useMultiplayer.ts";
import {InfinityStoneColor} from "../../multiplayer/infinityTypes.ts";


interface ServerComponentProps {
    roomId: string;
}

const ServerComponent: FC<ServerComponentProps> = ({roomId}) => {
    const {useGetPlayersScore} = useMultiplayer();
    const currentScore = useGetPlayersScore(roomId);

    // TODO write all logic for players and light up stones
    return <>
        <div style={{color: "white"}}>Game Score: {currentScore}</div>
        <div style={{color: "yellow"}}>Server Page</div>
    </>
}

export default ServerComponent;