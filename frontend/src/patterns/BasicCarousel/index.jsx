import { Box, Flex } from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';
import { ChakraNextImage } from '../ChakraNextImage';

const BasicCarousel = ({ images = [], useBlackOverlay }) => {
    const carouselRef = useRef(null);
    const intervalRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to start auto-slide with interval reset
    const startAutoSlide = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
    };

    // Initial start of auto-slide
    useEffect(() => {
        startAutoSlide();
        return () => clearInterval(intervalRef.current); // Clear interval on unmount
    }, [images.length]);

    // Scroll to the respective image when currentIndex changes
    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            const slideWidth = carousel.offsetWidth;
            const gap = parseInt(getComputedStyle(carousel).gap); // 2vw converted to pixels
            carousel.scrollTo({
                left: currentIndex * (slideWidth + gap),
                behavior: 'smooth',
            });
        }
    }, [currentIndex]);

    // Handle indicator click to reset auto-slide and update currentIndex
    const handleIndicatorClick = (index) => {
        setCurrentIndex(index);
        startAutoSlide(); // Restart auto-slide on manual selection
    };

    return (
        <Box w="100%" h="100%" position="relative" overflow="hidden" borderRadius={["4.167vw", "2.083vw"]}>
            <Flex ref={carouselRef} w="100%" h="100%" overflow="hidden" borderRadius={["4.167vw", "2.083vw"]} gap="2vw">
                {images.map((img, index) => (
                    <Box
                        key={index}
                        minW="100%" // Ensures each image takes full width of carousel
                        h="100%"
                        flex="none" // Prevents images from shrinking
                        borderRadius={["4.167vw", "2.083vw"]}
                        position={"relative"}
                    >
                        {useBlackOverlay && <Box
                            w={"100%"}
                            h={"100%"}
                            position={"absolute"}
                            top={0}
                            left={0}
                            bg={"rgba(0,0,0,0.5)"}
                            zIndex={5}
                            borderRadius={["4.167vw", "2.083vw"]}
                        ></Box>}
                        <ChakraNextImage src={img} borderRadius={["4.167vw", "2.083vw"]} alt={`carousel-image-${index}`} w="100%" h="100%" objectFit="cover" />
                    </Box>
                ))}
            </Flex>

            {/* Indicators */}
            <Flex
                position="absolute"
                bottom={["9.167vw", "6.25vw"]}
                right={["8.33vw", "5.83vw"]}
                zIndex={20}
                gap="0.7vw"
            >
                {images.map((_, index) => (
                    <Box
                        key={index}
                        w={["1.4vw", "0.7vw"]}
                        h={["1.4vw", "0.7vw"]}
                        bg={index === currentIndex ? "primary_3" : "#EFE9E4"}
                        borderRadius="100%"
                        cursor="pointer"
                        onClick={() => handleIndicatorClick(index)}
                    />
                ))}
            </Flex>
        </Box>
    );
};

export default BasicCarousel;
