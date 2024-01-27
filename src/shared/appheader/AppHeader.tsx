import GlobalStyles from "../../assets/css/GlobalStyles.module.css"
import AppHeaderStyles from "./AppHeader.module.css"
import classnames from 'classnames'
import {NavLink} from "react-router-dom";

const AppHeader = () => {
    return (
        <div
            className={classnames(
                AppHeaderStyles.container, GlobalStyles.flex, GlobalStyles.gap
            )}
        >
            <NavLink
                to={"/"}
                className={classnames(
                    GlobalStyles.flex, GlobalStyles.flexDirectionColumn
                )}
            >
                <div className={classnames()}>Gauntlet of Giggles</div>
                <div className={classnames(AppHeaderStyles.headerSecondaryText)}>Laugh or Snap</div>
            </NavLink>
        </div>)
}

export default AppHeader;