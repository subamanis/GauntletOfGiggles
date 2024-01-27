import GlobalStyles from "../../assets/css/GlobalStyles.module.css"
import LandingPageStyles from "./LandingPage.module.css"
import classnames from 'classnames'
import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
            <div 
            className={classnames(
                LandingPageStyles.container, GlobalStyles.flex, GlobalStyles.flexDirectionColumn, GlobalStyles.gap
                )}
            >
                <Link
                    to="/create-session"
                    className={classnames(LandingPageStyles.button, LandingPageStyles.createButton, GlobalStyles.flex1, GlobalStyles.centerVertical)}
                >Create Session</Link>
                <Link
                    to="/join-session"
                    className={classnames(LandingPageStyles.button, LandingPageStyles.joinButton, GlobalStyles.flex1, GlobalStyles.centerVertical)}
                >Join Session</Link>
            </div>)
}

export default LandingPage;