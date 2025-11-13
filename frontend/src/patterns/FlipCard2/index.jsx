import React, { useState, useEffect, useRef } from "react";

const FlipCard2 = ({ frontContent, backContent }) => {
    const [flipped, setFlipped] = useState(false);
    const frontRef = useRef(null);
    const backRef = useRef(null);
    const cardContainerRef = useRef(null);

    useEffect(() => {
        const updateDimensions = () => {
            if (frontRef.current && backRef.current) {
                const { width, height } =
                    frontRef.current.getBoundingClientRect();
                backRef.current.style.width = `${width}px`;
                backRef.current.style.height = `${height}px`;
                cardContainerRef.current.style.width = `${width}px`;
                cardContainerRef.current.style.height = `${height}px`;
            }
        };

        const resizeObserver = new ResizeObserver(updateDimensions);
        if (frontRef.current) {
            resizeObserver.observe(frontRef.current); // Observe the front content for any size changes
        }

        // Initial size set
        updateDimensions();

        return () => {
            if (frontRef.current) {
                resizeObserver.unobserve(frontRef.current); // Cleanup observer on unmount
            }
        };
    }, []);

    return (
        <div
            ref={cardContainerRef}
            onClick={() => setFlipped(!flipped)}
            className={"card-container" + (flipped ? " flipped" : "")}
        >
            <div ref={frontRef} className="front">
                {frontContent}
            </div>
            <div ref={backRef} className="back">
                {backContent}
            </div>
        </div>
    );
};

export default FlipCard2;
