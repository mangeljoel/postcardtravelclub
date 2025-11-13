import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";

const swipe = keyframes`
  0% {
    transform: translate(0);
  }
  100% {
    transform: translate(-100%);
  }
`;

const AutoSlideshow = ({ images = [], cards = [], speed = 5000 }) => {
    const content = images.length ? images : cards;
    const isCardMode = images.length === 0;

    return (
        <Box position="relative" width="100%" overflow="hidden" mt={["4vw", "2vw"]}>
            <Box display="flex">
                {[...Array(3)].map((_, idx) => (
                    <Box
                        as="section"
                        key={idx}
                        display="flex"
                        animation={`${swipe} ${speed}ms linear infinite`}
                    >

                        {content.map((item, index) => (
                            <Box key={index} mx={[2, 4]}>
                                {images.length > 0 ? (
                                    <ChakraNextImage
                                        src={item}
                                        alt={`Press Logo ${index + 1}`}
                                        objectFit={"contain"}
                                        height={["auto"]}
                                        minWidth={["120px", "250px", "300px", "240px"]}
                                    />
                                ) : (
                                    item
                                )}
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default AutoSlideshow;
