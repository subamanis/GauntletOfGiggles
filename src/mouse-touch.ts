import React from 'react';
import isMobile from "./utils.ts";
const useMouseTouch = () => {
    let x = 0;
    let y = 0;
    let isTouching = false;
    const [
        mouseTouch,
        setMouseTouch
    ] = React.useState({ x: 0, y: 0, isTouching: false });
    React.useEffect(() => {
        const onMouseOrTouchDown = (ev: any) => {
            isTouching = true;
            if (ev.touches) {
                const touch = ev.touches[0];
                [x, y] = [touch.clientX, touch.clientY];
            } else {
                [x, y] = [ev.clientX, ev.clientY];
            }
            setMouseTouch({ x, y, isTouching});
        }
        const onMouseOrTouchUp = (ev: any) => {
            isTouching = false;
            [x, y] = [0, 0];
            setMouseTouch({ x, y, isTouching});
        }
        if (isMobile()) {
            window.addEventListener('touchstart', onMouseOrTouchDown);
            window.addEventListener('touchEnd', onMouseOrTouchDown);
        } else {
            window.addEventListener('mousedown', onMouseOrTouchDown);
            window.addEventListener('mouseup', onMouseOrTouchDown);
        }
        return () => {
            if (isMobile()) {
                window.removeEventListener('touchstart', onMouseOrTouchUp);
                window.removeEventListener('touchEnd', onMouseOrTouchUp);
            } else {
                window.removeEventListener('mousemove', onMouseOrTouchUp);
                window.removeEventListener('mouseup', onMouseOrTouchUp);
            }
        };
    }, []);
    return mouseTouch;
};
export default useMouseTouch;