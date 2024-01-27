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
            <div 
            className={classnames(
                GlobalStyles.flex, GlobalStyles.flexDirectionColumn
                )}
            >
                <div className={classnames()}>Gauntlet of Giggles</div>
                <div className={classnames(AppHeaderStyles.headerSecondaryText)}>Laugh or Snap</div>
                </div>
                <div className={classnames(GlobalStyles.flex1)}/>
                <Link
                    to="/mouse-event-test"
                    className={classnames(AppHeaderStyles.button, GlobalStyles.centerVertical)}
                >Test</Link>
            </div>)
}

export default AppHeader;