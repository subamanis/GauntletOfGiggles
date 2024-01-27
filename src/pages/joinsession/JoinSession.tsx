import { useState } from "react"
import GlobalStyles from "../../assets/css/GlobalStyles.module.css"
import JoinSessionStyles from "./JoinSession.module.css"
import classnames from 'classnames'
import { Link } from 'react-router-dom'

const JoinSession = () => {
    const [roomId, setroomId] = useState<string>("");

    const handleroomIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setroomId(event.target.value);
      };
    
    return (
        <div className={classnames(JoinSessionStyles.container, GlobalStyles.flex, GlobalStyles.overflowHiddenFullHeight)}>       
            <div className={classnames(GlobalStyles.flex1)}/>
            <div className={classnames(GlobalStyles.flex, GlobalStyles.flex1, GlobalStyles.flexDirectionColumn, GlobalStyles.gap2)}>
                <div className={classnames(GlobalStyles.flex, GlobalStyles.flexDirectionColumn, GlobalStyles.gap05)}>
                    <div>Room ID:</div>
                    <input className={classnames(JoinSessionStyles.input)} type="number" value={roomId} onChange={handleroomIdChange} />
                </div>
                <div className={classnames(GlobalStyles.flex, GlobalStyles.gap)}>
                    <Link to={"/"} className={classnames(JoinSessionStyles.button, JoinSessionStyles.backButton)}>
                        Back
                    </Link>
                    <div className={classnames(GlobalStyles.flex1)}/>
                    {roomId !== "" ? <Link to={roomId} className={classnames(JoinSessionStyles.button, JoinSessionStyles.joinButton)}>
                        Join
                    </Link> : 
                    <div className={classnames(JoinSessionStyles.button, JoinSessionStyles.joinButton, JoinSessionStyles.buttonDisabled)}>
                    Join
                </div>}
                </div>
            </div>
            <div className={classnames(GlobalStyles.flex1)}/>
        </div>
    )
}

export default JoinSession;