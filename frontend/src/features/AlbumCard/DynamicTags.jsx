import React, { useEffect, useRef, useState } from "react";
import { Flex, Text, useBreakpointValue } from "@chakra-ui/react";

const DynamicTags = ({ tagList = [] }) => {
    const containerRef = useRef(null);
    const [visibleTags, setVisibleTags] = useState([]);
    const [extraTagsCount, setExtraTagsCount] = useState(0);

    // Use Chakra's useBreakpointValue for responsive values
    const fontSize = useBreakpointValue({ base: "9px", lg: "0.833vw" });
    const paddingOffset = useBreakpointValue({ base: "26px", lg: "2vw" }); // total padding (mx * 2)
    const plusCountTagWidth = useBreakpointValue({ base: "23px", lg: "30px" });
    const gapSize = useBreakpointValue({ base: 6, lg: 7 }); // Responsive gap size

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (containerRef.current && tagList.length > 0) {
                calculateVisibleTags();
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, [tagList, fontSize, paddingOffset, plusCountTagWidth, gapSize]);

    const calculateVisibleTags = () => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            let totalTagWidth = 0;
            let tagCount = 0;

            const calculatedPlusCountTagWidth = 1.5 * parseFloat(plusCountTagWidth);

            for (let i = 0; i < tagList.length; i++) {
                const tagWidth = measureTagWidth(tagList[i], fontSize, paddingOffset);

                if (
                    totalTagWidth + tagWidth + (tagCount > 0 ? gapSize : 0) + calculatedPlusCountTagWidth + gapSize >=
                    containerWidth
                ) {
                    break;
                }

                totalTagWidth += tagWidth + (tagCount > 0 ? gapSize : 0);
                tagCount++;
            }

            setVisibleTags(tagList.slice(0, tagCount));
            setExtraTagsCount(tagList.length - tagCount);
        }
    };

    // Helper function to convert padding values to pixels
    const convertPaddingToPx = (paddingOffset) => {
        if (typeof paddingOffset === "string") {
            if (paddingOffset.endsWith("vw")) {
                return (parseFloat(paddingOffset) * window.innerWidth) / 100;
            } else if (paddingOffset.endsWith("px")) {
                return parseFloat(paddingOffset);
            }
        }
        return paddingOffset;
    };

    // Helper function to measure the width of a tag, factoring in responsive fontSize and padding
    const measureTagWidth = (tag, fontSize, paddingOffset) => {
        const tempElement = document.createElement("p");
        tempElement.style.visibility = "hidden";
        tempElement.style.position = "absolute";
        tempElement.style.whiteSpace = "nowrap";
        tempElement.style.fontFamily = "raleway";
        tempElement.style.fontSize = fontSize;
        tempElement.innerText = tag;
        document.body.appendChild(tempElement);

        const width = tempElement.offsetWidth + convertPaddingToPx(paddingOffset);
        document.body.removeChild(tempElement);
        return width;
    };

    return (
        <Flex
            ref={containerRef}
            mt={["7px", "7px", "7px", "0.503vw"]}
            h={["20px", "20px", "20px", "1.53vw"]}
            gap={["6px", "6px", "6px", "0.5vw"]}
            wrap="nowrap"
            overflow="hidden"
        >
            {visibleTags.map((tag) => (
                <Flex
                    key={tag}
                    bg={"#D9D9D9"}
                    borderRadius={["9px", "9px", "9px", "0.69vw"]}
                    alignItems={"center"}
                    flexShrink={0}
                    whiteSpace="nowrap"
                >
                    <Text
                        fontFamily={"raleway"}
                        fontSize={["10px", "10px", "10px", "0.833vw"]}
                        lineHeight={["12px", "12px", "12px", "0.94vw"]}
                        mx={["14px", "14px", "14px", "0.97vw"]} // Responsive margin for larger screens
                        color={"#111111"}
                        whiteSpace="nowrap"
                        textTransform={"capitalize"}
                    >
                        {tag}
                    </Text>
                </Flex>
            ))}

            {extraTagsCount > 0 && (
                <Flex
                    maxW={"30px"}
                    bg={"#D9D9D9"}
                    borderRadius={["9px", "9px", "9px", "0.69vw"]}
                    alignItems={"center"}
                    flexShrink={0}
                    whiteSpace="nowrap"
                >
                    <Text
                        fontFamily={"raleway"}
                        fontSize={["10px", "10px", "10px", "0.833vw"]}
                        lineHeight={["12px", "12px", "12px", "0.94vw"]}
                        w={["20px", "20px", "20px", plusCountTagWidth]} // Ensure consistent width for the +count tag
                        color={"#111111"}
                        whiteSpace="nowrap"
                        textAlign={"center"}
                    >
                        +{extraTagsCount}
                    </Text>
                </Flex>
            )}
        </Flex>
    );
};

export default DynamicTags;
