import  {useEffect, useState} from 'react';
import isMobile from "./utils.ts";

const useMousePosition = () => {
    let lastPositionX = 0;
    let lastPositionY = 0;
    let currentPositionX = 0;
    let currentPositionY = 0;
    const [
        mousePosition,
        setMousePosition
    ] = useState({ x: 0, y: 0, lastX: 0, lastY: 0 });
    useEffect(() => {
        const updateMousePosition = (ev: any) => {
            lastPositionX = currentPositionX;
            lastPositionY = currentPositionY;
            if (ev.touches) {
                const touch = ev.touches[0];
                [currentPositionX, currentPositionY] = [touch.clientX, touch.clientY];
            } else {
                [currentPositionX, currentPositionY] = [ev.clientX, ev.clientY];
            }
            setMousePosition({ x: currentPositionX, y: currentPositionY, lastX: lastPositionX, lastY: lastPositionY});
        };
        if (isMobile()) {
            window.addEventListener('touchmove', updateMousePosition);
        } else {
            window.addEventListener('mousemove', updateMousePosition);
        }
        return () => {
            if (isMobile()) {
                window.removeEventListener('touchmove', updateMousePosition);
            } else {
                window.removeEventListener('mousemove', updateMousePosition);
            }
        };
    }, []);
    return mousePosition;
};
export default useMousePosition;