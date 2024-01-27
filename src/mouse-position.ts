import React from 'react';
const useMousePosition = (includeTouch: boolean) => {
    let lastPositionX = 0;
    let lastPositionY = 0;
    let currentPositionX = 0;
    let currentPositionY = 0;
    const [
        mousePosition,
        setMousePosition
    ] = React.useState({ x: 0, y: 0, lastX: 0, lastY: 0 });
    React.useEffect(() => {
        // const aa = includeTouch;

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
        window.addEventListener('mousemove', updateMousePosition);
        if (includeTouch) {
            window.addEventListener('touchmove', updateMousePosition);
        }
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            if (includeTouch) {
                window.removeEventListener('touchmove', updateMousePosition);
            }
        };
    }, [includeTouch]);
    return mousePosition;
};
export default useMousePosition;