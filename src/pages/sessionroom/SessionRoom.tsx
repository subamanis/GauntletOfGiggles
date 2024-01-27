import GlobalStyles from "../../assets/css/GlobalStyles.module.css"
import SessionRoomStyles from "./SessionRoom.module.css"
import classnames from 'classnames'
import {useNavigate, useParams} from 'react-router-dom'
import useMultiplayer from "../../multiplayer/useMultiplayer";
import {InfinityStoneColor} from "../../multiplayer/infinityTypes"

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
    const {roomId} = useParams();
    const navigate = useNavigate()
    const {useGetAvailablePlayersInRoom, joinRoom}
        = useMultiplayer();

    const availableStones = useGetAvailablePlayersInRoom(roomId!);

    const onStoneSelect = (selectedInfinityStone: InfinityStoneColor) => {
        joinRoom(roomId!, selectedInfinityStone)
            .then(() => navigate("color/" + selectedInfinityStone));
    }

    return (
        <div className={classnames(GlobalStyles.flex1, GlobalStyles.flex, GlobalStyles.flexDirectionColumn)}>
            {availableStones.length > 0 ?
                <div
                    className={classnames(GlobalStyles.justifyContentSpaceEvenly, GlobalStyles.flex, GlobalStyles.flexDirectionColumn, GlobalStyles.flex1, GlobalStyles.gap2)}>
                    {availableStones.map(infinityStoneItem => <div key={infinityStoneItem}
                                                                   className={classnames(GlobalStyles.flex1, SessionRoomStyles.stoneButton)}
                                                                   onClick={() => onStoneSelect(infinityStoneItem)}>{infinityStonesDisplayMap.get(infinityStoneItem)}</div>)}
                </div> :
                <div>No stones available</div>
            }
        </div>
    )
}

export default SessionRoom;