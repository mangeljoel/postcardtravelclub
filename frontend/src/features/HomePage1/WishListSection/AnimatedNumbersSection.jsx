import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const AnimatedNumber = ({ startNumber, endNumber }) => {
    const numberRef = useRef(null);

    useEffect(() => {
        const element = numberRef.current;
        if (!element) return;

        function incNbrRec(currentNumber) {
            if (currentNumber <= endNumber) {
                element.innerHTML = currentNumber;
                setTimeout(() => {
                    incNbrRec(currentNumber + 1);
                }, 5); // Speed of animation in milliseconds
            }
        }

        incNbrRec(startNumber);
    }, [endNumber]);

    return (
        <Flex
            alignItems="center"
            fontFamily={"lora"}
            fontWeight={400}
            fontSize={["7.91vw", "3.95vw"]}
            lineHeight={["6.11vw", "3.021vw"]}
            w={["33.05vw", "13.75vw"]}
        >
            <Box ref={numberRef}>{startNumber}</Box>+
        </Flex>
    );
};

const AnimatedBlock = ({ startNumber, endNumber, text }) => {
    return (
        <Flex
            flexDirection="column"
            color={"#EFE9E4"}
            gap={["3.89vw", "1.875vw"]}
            position={"relative"}
            opacity={1}
            transition="opacity 1s ease-in-out"
            justify={"space-between"}
        >
            <Flex fontFamily={"lora"} fontWeight={400}>
                <AnimatedNumber
                    startNumber={startNumber}
                    endNumber={endNumber}
                />

                <Box
                    fontFamily={"raleway"}
                    fontWeight={600}
                    fontSize={["3.33vw", "1.67vw"]}
                    lineHeight={["3.88vw", "1.97vw"]}
                    maxW={["21.11vw", "10.2vw"]}
                >
                    {text}
                </Box>
            </Flex>
            <Box
                height={"2px"}
                bg={"#EFE9E4"}
                width="100%"
            // maxWidth={["500px", "500px", "500px", "550px"]}
            ></Box>
        </Flex>
    );
};

const AnimatedNumbersSection = () => {
    const [hasStarted, setHasStarted] = useState(false);
    const sectionRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <Flex
            ref={sectionRef}
            w={["100%", "37.60vw"]}
            flexDirection={"column"}
            gap={["2vw", "1.875vw"]}
            position={"relative"}
        >
            {hasStarted && (
                <>
                    <AnimatedBlock
                        startNumber={300}
                        endNumber={500}
                        text="Unique Interests"
                    />
                    <AnimatedBlock
                        startNumber={400}
                        endNumber={600}
                        text="Immersive Experiences"
                    />
                    <AnimatedBlock
                        startNumber={100}
                        endNumber={300}
                        text="Tours & Properties"
                    />
                    <AnimatedBlock
                        startNumber={0}
                        endNumber={35}
                        text="Countries Represented"
                    />
                </>
            )}
        </Flex>
    );
};

export default AnimatedNumbersSection;
