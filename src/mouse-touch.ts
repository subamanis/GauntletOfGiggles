import React from 'react';
import {isMobile} from "./utils.ts";

const useMouseTouch = () => {

    const [
        mouseTouch,
        setMouseTouch
    ] = React.useState<{ x: number | null, y: number | null, touches: number }>({x: null, y: null, touches: 0});
    React.useEffect(() => {
        const onMouseOrTouchDown = (ev: Event) => {
            const convertedEvent = ev as WindowEventMap['touchstart'] & WindowEventMap['mousedown'];
            let x, y;
            if (convertedEvent.touches) {
                const touch = convertedEvent.touches[0];
                [x, y] = [touch.clientX, touch.clientY];
            } else {
                [x, y] = [convertedEvent.clientX, convertedEvent.clientY];
            }
            setMouseTouch({x, y, touches: convertedEvent.touches?.length ?? 1});
        }
        const onMouseOrTouchUp = () => {
            setMouseTouch({x: null, y: null, touches: 0});
        }
        if (isMobile()) {
            window.addEventListener('touchstart', onMouseOrTouchDown);
            window.addEventListener('touchend', onMouseOrTouchUp);
        } else {
            window.addEventListener('mousedown', onMouseOrTouchDown);
            window.addEventListener('mouseup', onMouseOrTouchUp);
        }
        return () => {
            if (isMobile()) {
                window.removeEventListener('touchstart', onMouseOrTouchDown);
                window.removeEventListener('touchEnd', onMouseOrTouchUp);
            } else {
                window.removeEventListener('mousemove', onMouseOrTouchDown);
                window.removeEventListener('mouseup', onMouseOrTouchUp);
            }
        };
    }, []);
    return mouseTouch;
};
export default useMouseTouch;