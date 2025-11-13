import { Box } from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import { Waypoint } from "react-waypoint";

const FlipCard1 = ({ frontContent, backContent, firstLoad = false, setFirstLoad = () => { } }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [dimensions, setDimensions] = useState({
        width: "auto",
        height: "auto"
    });
    const frontRef = useRef(null);

    const handleClick = () => {
        if (!backContent) return;
        setIsFlipped((prev) => !prev);
    };

    // Update card dimensions using ResizeObserver
    useEffect(() => {
        const updateDimensions = (entries) => {
            for (let entry of entries) {
                if (entry.target) {
                    const { width, height } =
                        entry.target.getBoundingClientRect();
                    setDimensions({ width, height });
                }
            }
        };

        const observer = new ResizeObserver(updateDimensions);
        if (frontRef.current) {
            observer.observe(frontRef.current);
        }

        // Clean up observer on component unmount
        return () => {
            if (frontRef.current) {
                observer.unobserve(frontRef.current);
            }
        };
    }, []);

    return (
        <Box
            className="flip-card-new"
            style={{
                width: "100%",
                height: dimensions.height,
                perspective: "1000px" // Enable 3D perspective for the parent container
            }}
            mx="auto"
        >
            <ReactCardFlip
                isFlipped={isFlipped}
                flipDirection="horizontal"
                flipSpeedBackToFront={1}
                flipSpeedFrontToBack={1}
            >
                <Box
                    key="front"
                    className="flip-card-new"
                    onClick={handleClick}
                    ref={frontRef}
                    style={{
                        w: "fit-content",
                        backgroundColor: "#fff",
                        height: "100%",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        cursor: "pointer",
                        backfaceVisibility: "hidden", // Ensures the back is not visible when flipped
                        WebkitBackfaceVisibility: "hidden",
                        transformStyle: "preserve-3d" // Ensures 3D perspective is maintained
                    }}
                // w={["314px", "314px", "314px", "25vw"]}
                >
                    {frontContent}
                </Box>

                <Box
                    key="back"
                    onClick={handleClick}
                    className="flip-card-new"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        cursor: "pointer",
                        width: dimensions.width,
                        height: dimensions.height,
                        boxSizing: "border-box",
                        backfaceVisibility: "hidden", // Ensures the front is not visible when flipped
                        WebkitBackfaceVisibility: "hidden",
                        transformStyle: "preserve-3d",
                        // Control opacity for smoother transition on iOS
                        opacity: isFlipped ? 1 : 0,
                        // visibility: isFlipped ? "visible" : "hidden",
                        transition: "opacity 0s ease",
                        transitionDelay: isFlipped ? "0.4s" : "0.4s" // Delay matches flip animation timing
                    }}
                >
                    {backContent}
                </Box>
            </ReactCardFlip>
            <Waypoint
                scrollableAncestor="window"
                onEnter={() => {
                    if (firstLoad && frontRef.current) {
                        handleClick();
                        setTimeout(() => handleClick(), 2000);
                        setFirstLoad(false);
                    }
                }}
            ></Waypoint>
        </Box>
    );
};

export default FlipCard1;
