import classnames from "classnames"
import GlobalStyles from "../../assets/css/GlobalStyles.module.css"
import {GemToImageMap, InfinityStoneColor} from "../../multiplayer/infinityTypes.ts";

const GauntletTest = () => {
    const imageName = "ThanosCartoon";

    return <div style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative"
    }}>
        <div style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url("/thanos/${imageName}.jpg")`,
            backgroundSize: "200% 200%",
            backgroundPosition: "90% 50%",
            border: "5px solid blue", 
            // position: "relative", 
            // backgroundSize: "cover",
            // transform: "translate(-35%, -20%)",
            backgroundRepeat: "no-repeat",
            backgroundPositionX: "center",
            }} className={classnames(GlobalStyles.flex1)}>
    {/* <div style={{backgroundColor: "black", width: "100px", height: "100px", 
    transform: "translate(-50%, -50%)", position: "absolute", top: "50%", left: "50%"}}></div> */}
    </div>
    </div>
}

export default GauntletTest