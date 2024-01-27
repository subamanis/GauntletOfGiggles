import GlobalStyles from "../../assets/css/GlobalStyles.module.css"
import JoinSessionStyles from "./JoinSession.module.css"
import classnames from 'classnames'
import { Link } from 'react-router-dom'

const JoinSession = () => {
    return (
        <div className={classnames(JoinSessionStyles.container, GlobalStyles.flex, GlobalStyles.flexDirectionColumn, GlobalStyles.gap, GlobalStyles.overflowHiddenFullHeight)}>
                <div className={classnames()}>
                    Joined
                </div>
                <Link to={"/"} className={classnames()}>
                    Back
                </Link>
            </div>
    )
}

export default JoinSession;