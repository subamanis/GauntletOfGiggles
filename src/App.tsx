import { Outlet } from "react-router-dom";
import classnames from 'classnames'
import AppStyles from "./App.module.css"
import GlobalStyles from "./assets/css/GlobalStyles.module.css"
import AppHeader from './shared/appheader/AppHeader.tsx';

function App() {
    return (
        <div className={classnames(AppStyles.container, GlobalStyles.overflowHiddenFullHeight)}>
            <AppHeader/>
            <div className={classnames(AppStyles.outlet)}>
                <Outlet />
            </div>
        </div>
    )
}

export default App
