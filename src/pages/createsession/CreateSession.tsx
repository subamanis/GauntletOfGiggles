import { Link } from "react-router-dom"
import GlobalStyles from "../../assets/css/GlobalStyles.module.css"
import CreateSessionStyles from "./CreateSession.module.css"
import classnames from 'classnames'

const CreateSession = () => {
    return (
            <div className={classnames(CreateSessionStyles.container, GlobalStyles.flex, GlobalStyles.flexDirectionColumn, GlobalStyles.gap, GlobalStyles.overflowHiddenFullHeight)}>
                <div className={classnames()}>
                    Created New
                </div>
                <Link to={"/"} className={classnames()}>
                    Back
                </Link>
            </div>
        )
}

export default CreateSession;