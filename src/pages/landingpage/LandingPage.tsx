import { useState } from "react";
import GlobalStyles from "../../assets/css/GlobalStyles.module.css"
import useMultiplayer from "../../multiplayer/useMultiplayer";
import LandingPageStyles from "./LandingPage.module.css"
import classnames from 'classnames'
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
    const { createRoom } = useMultiplayer(); 
    const [showLoader, setShowLoader] = useState<boolean>(false)

    const onCreateRoom = () => {
        setShowLoader(true);
        createRoom().then(data => {
            if(data.roomId) {
                navigate("/join-session/" + data.roomId)
            }
        }).finally(() => setShowLoader(false))
    }

    return (
            <div 
            className={classnames(
                LandingPageStyles.container, GlobalStyles.flex, GlobalStyles.flexDirectionColumn, GlobalStyles.gap
                )}
            >
                <div
                    onClick={onCreateRoom}
                    className={classnames(LandingPageStyles.button, LandingPageStyles.createButton, GlobalStyles.flex1, GlobalStyles.centerVertical)}
                >{showLoader ? "Loading..." : "Create Session"}</div>
                <Link
                    to="/join-session"
                    className={classnames(LandingPageStyles.button, LandingPageStyles.joinButton, GlobalStyles.flex1, GlobalStyles.centerVertical)}
                >Join Session</Link>
            </div>)
}

export default LandingPage;