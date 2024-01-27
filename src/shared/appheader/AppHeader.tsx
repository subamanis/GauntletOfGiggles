import GlobalStyles from "../../assets/css/GlobalStyles.module.css"
import AppHeaderStyles from "./AppHeader.module.css"
import classnames from 'classnames'
import { Link } from "react-router-dom";

const AppHeader = () => {
    return (
            <div 
            className={classnames(
                AppHeaderStyles.container, GlobalStyles.flex, GlobalStyles.gap
                )}
            >
                <div className={classnames(GlobalStyles.flex1)}/>
                <div className={classnames()}>Gauntlet of Giggles: Laugh or Snap</div>
                <div className={classnames(GlobalStyles.flex1)}/>
            </div>)
}

export default AppHeader;