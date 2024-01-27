import {useEffect, useState} from 'react'
import {ref, onValue} from "firebase/database";
import { realTimeDatabase} from "./firebase/firebaseInit.ts";
import { Outlet } from "react-router-dom";
import classnames from 'classnames'
import AppStyles from "./App.module.css"
import GlobalStyles from "./assets/css/GlobalStyles.module.css"
import AppHeader from './shared/appheader/AppHeader.tsx';

function App() {
    const [count, setCount] = useState(0)
    // console.log("myFirebaseInit", myFirebaseInit);


    // onValue(starCountRef, (snapshot) => {
    //     console.log(snapshot.val());
    //     const data = Number(snapshot.val());
    //     setCount(data);
    // });

    // const dbRef = ref(getDatabase());
    // get(child(dbRef, `sessions/1234`)).then((snapshot) => {
    //     if (snapshot.exists()) {
    //         console.log(snapshot.val());
    //     } else {
    //         console.log("No data available");
    //     }
    // }).catch((error) => {
    //     console.error(error);
    // });

    useEffect(() => {
        // console.log(realTimeDatabase);
        const sessionId = 1234;

        const starCountRef = ref(realTimeDatabase, `sessions/${sessionId}`);

        return onValue(starCountRef, (snapshot) => {
            console.log("yolo")
            console.log(snapshot.val());
            setCount(snapshot.val().blue);
        });
    }, []);

    return (
        <div className={classnames(AppStyles.container, GlobalStyles.overflowHiddenFullHeight)}>
            {/* <button>
                count is yolo {count}
            </button> */}
            <AppHeader/>
            <div className={classnames(AppStyles.outlet)}>
                <Outlet />
            </div>
        </div>
    )
}

export default App
