import { useState } from "react"
import GlobalStyles from "../../assets/css/GlobalStyles.module.css"
import SessionRoomStyles from "./SessionRoom.module.css"
import classnames from 'classnames'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useMultiplayer from "../../multiplayer/useMultiplayer";
import { InfinityRoom, InfinityStoneColor } from "../../multiplayer/infinityTypes"

enum InfinityStoneColorDisplayEnum {
    red = "Reality Stone",
    blue = "Space Stone",
    yellow = "Mind Stone",
    purple = "Power Stone",
    green = "Time Stone",
    orange = "Soul Stone",
}

const infinityStonesDisplayMap: Map<InfinityStoneColor, InfinityStoneColorDisplayEnum> = new Map([
    ["Red", InfinityStoneColorDisplayEnum.red],
    ["Blue", InfinityStoneColorDisplayEnum.blue],
    ["Yellow", InfinityStoneColorDisplayEnum.yellow],
    ["Purple", InfinityStoneColorDisplayEnum.purple],
    ["Green", InfinityStoneColorDisplayEnum.green],
    ["Orange", InfinityStoneColorDisplayEnum.orange],
])

const SessionRoom = () => {
    const {sessionId} = useParams();
    const navigate = useNavigate()
    const {useGetAvailablePlayersInRoom, joinRoom}
        = useMultiplayer();

    const myInfinityRoom: InfinityRoom = {roomId: sessionId!}
    const availableStones = useGetAvailablePlayersInRoom(myInfinityRoom);

    const onStoneSelect = (selectedInfinityStone: InfinityStoneColor) => {
        joinRoom(myInfinityRoom, selectedInfinityStone)
        .then(() => navigate("color/"+selectedInfinityStone));
    }

    return (
            <div className={classnames(GlobalStyles.flex)}>
                <div className={classnames(GlobalStyles.flex1)}/>
                {availableStones.length > 0 ? 
                    <div className={classnames(GlobalStyles.flex, GlobalStyles.flex10, GlobalStyles.flexWrap, GlobalStyles.gap)}>
                        {availableStones.map(infinityStoneItem => <div className={classnames(SessionRoomStyles.stoneButton)}
                        onClick={() => onStoneSelect(infinityStoneItem)}>{infinityStonesDisplayMap.get(infinityStoneItem)}</div>)}
                    </div> : 
                    <div>No stones available</div>
                }
                <div className={classnames(GlobalStyles.flex1)}/>
            </div>
            )
}

export default SessionRoom;