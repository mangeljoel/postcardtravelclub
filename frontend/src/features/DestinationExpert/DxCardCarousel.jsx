import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Icon, IconButton, Image, Spinner, Text, useBreakpointValue } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { IoIosAdd, IoMdCrop } from 'react-icons/io';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FlipIcon, TrashIcon } from '../../styles/ChakraUI/icons';
import FlipCard1 from '../../patterns/FlipCard1';
import LoadingGif from '../../patterns/LoadingGif';

const DxCardCarousel = ({ allowImageUpload, onImageUpload, carouselMedia = [], setDxCardMode, blockImageLoading }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cropImageIndex, setCropImageIndex] = useState(null)
    const carouselRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const didMove = useRef(false);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const maxImages = 6;
    const shouldShowAddSlide = allowImageUpload && carouselMedia.length < maxImages;
    const remainingSlots = maxImages - carouselMedia.length;
    const prevImagesLength = useRef(shouldShowAddSlide ? carouselMedia.length + 1 : carouselMedia.length);

    const images = shouldShowAddSlide
        ? [...carouselMedia, { isAddSlide: true }]
        : [...carouselMedia];

    const scrollToIndex = (index) => {
        const carousel = carouselRef.current;
        if (carousel) {
            const cardWidth = carousel.offsetWidth;
            carousel.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth',
            });
        }
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        setCurrentIndex(newIndex);
        scrollToIndex(newIndex);
    };

    const handleNext = (e) => {
        e.stopPropagation();
        const newIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(newIndex);
        scrollToIndex(newIndex);
    };

    const handleIndicatorClick = (index) => {
        setCurrentIndex(index);
        scrollToIndex(index);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        didMove.current = false; // reset movement tracker
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
        if (Math.abs(touchEndX.current - touchStartX.current) > 10) {
            didMove.current = true;
        }
    };

    const handleTouchEnd = (e) => {
        if (!didMove.current) return; // prevent swipe if it was a tap

        const deltaX = touchStartX.current - touchEndX.current;

        if (Math.abs(deltaX) < 50) return;

        if (deltaX > 0) {
            handleNext(e); // swipe left
        } else {
            handlePrev(e); // swipe right
        }
    };

    // useEffect(() => {
    //     scrollToIndex(currentIndex);
    // }, [images.length]);
    useEffect(() => {
        const currentImagesLength = shouldShowAddSlide ? carouselMedia.length + 1 : carouselMedia.length;
        const previousLength = prevImagesLength.current;

        // If cropImageIndex is provided (crop operation), set index to that image
        if (cropImageIndex !== undefined && cropImageIndex !== null) {
            console.log("cropping")
            const targetIndex = Math.min(cropImageIndex, images.length - 1);
            setCurrentIndex(targetIndex);
            scrollToIndex(targetIndex);
            setCropImageIndex(null)
        }
        // If images array length changed, set to last index of previous array
        else if (currentImagesLength !== previousLength) {
            // When images are added, go to the last index of the previous array
            // When images are deleted, ensure we don't go out of bounds
            const targetIndex = Math.min(previousLength - 1, images.length - 1);
            const safeIndex = Math.max(0, targetIndex);
            setCurrentIndex(safeIndex);
            scrollToIndex(safeIndex);
        }
        // Normal case: just scroll to current index if images length changed
        else {
            scrollToIndex(currentIndex);
        }

        // Update the ref with current length for next comparison
        prevImagesLength.current = currentImagesLength;
    }, [images.length, carouselMedia]);

    const currentImage = images[currentIndex];
    const isAddSlide = currentImage?.isAddSlide;

    return (
        <FlipCard1
            frontContent={
                !blockImageLoading ? (
                    <Box
                        w={["100%", "314px", "314px", "25vw"]}
                        minW={["90vw", "314px", "314px", "25vw"]}
                        h={["514px", "514px", "514px", "36vw"]}
                        minH={["514px", "514px", "514px", "36vw"]}
                        position="relative"
                        overflow="hidden"
                        borderTopRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                        cursor="normal"
                    >
                        <Box
                            ref={carouselRef}
                            overflow="hidden"
                            w="100%"
                            h="100%"
                            borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                            position="relative"
                        >
                            <Flex
                                w="100%"
                                h="100%"
                                {...(isMobile ? {
                                    onTouchStart: handleTouchStart,
                                    onTouchMove: handleTouchMove,
                                    onTouchEnd: handleTouchEnd,
                                    scrollSnapType: "x",
                                    scrollBehavior: "smooth"
                                } : {})}
                            >
                                {images.map((img, index) => (
                                    <Box
                                        key={index}
                                        flex="none"
                                        w="100%"
                                        h="100%"
                                        position="relative"
                                        borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                                    >
                                        {img.isAddSlide ? (
                                            <Flex
                                                w="100%"
                                                h="100%"
                                                flexDirection="column"
                                                alignItems="center"
                                                justify="center"
                                                bg="rgba(17,17,17,0.5)"
                                                position="absolute"
                                                // zIndex={5}
                                                borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                                            >
                                                <Box
                                                    bg="white"
                                                    borderRadius="lg"
                                                    w="2em"
                                                    h="2em"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    cursor="pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onImageUpload();
                                                    }}
                                                >
                                                    <Icon as={IoIosAdd} w="1.5em" h="1.5em" color="primary_3" />
                                                </Box>
                                                <Text color="white" mt={3}>
                                                    You can add {remainingSlots} more image{remainingSlots > 1 ? 's' : ''}.
                                                </Text>
                                                {/* ✅ Close Button added here */}
                                                {/* <Button
                                                variant="none"
                                                position="absolute"
                                                bottom={["3vw", "1vw"]}
                                                right={["3vw", "1.5vw"]}
                                                p={0}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDxCardMode("normal");
                                                }}
                                            >
                                                <Icon
                                                    as={CloseIcon}
                                                    w="100%"
                                                    h={["24px", "24px", "24px", "1.80vw"]}
                                                    color="primary_1"
                                                />
                                            </Button> */}
                                            </Flex>
                                        ) : (
                                            <>
                                                <Image
                                                    src={img.url}
                                                    alt={`carousel - ${index}`}
                                                    w="100%"
                                                    h="100%"
                                                    objectFit="cover"
                                                    borderTopRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                                                />
                                                {allowImageUpload && <Flex position="absolute" top={["3vw", "1vw"]} right={["3vw", "1.5vw"]} gap={2}>
                                                    <IconButton
                                                        icon={<EditIcon fontSize="20px" />}
                                                        variant="none"
                                                        w="40px"
                                                        h="40px"
                                                        color="primary_1"
                                                        bg="#FFF4D8"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCropImageIndex(index)
                                                            onImageUpload("crop", index);
                                                        }}
                                                    />
                                                    <IconButton
                                                        as={TrashIcon}
                                                        variant="none"
                                                        w="40px"
                                                        h="40px"
                                                        color="primary_1"
                                                        bg="#FFF4D8"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onImageUpload("delete", index);
                                                        }}
                                                    />
                                                </Flex>}
                                                {/* <Button
                                                variant="none"
                                                position="absolute"
                                                bottom={["3vw", "1vw"]}
                                                right={["3vw", "1.5vw"]}
                                                p={0}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDxCardMode("normal");
                                                }}
                                            >
                                                <Icon
                                                    as={CloseIcon}
                                                    w="100%"
                                                    h={["24px", "24px", "24px", "1.80vw"]}
                                                    color="primary_1"
                                                />
                                            </Button> */}
                                            </>
                                        )}
                                    </Box>
                                ))}
                            </Flex>
                        </Box>

                        {/* Arrows */}
                        {images.length > 1 && (
                            <>
                                <Button
                                    variant="none"
                                    position="absolute"
                                    top="50%"
                                    left="0"
                                    p={0}
                                    transform="translateY(-50%)"
                                    borderRadius={"50%"}
                                    zIndex={20}
                                    onClick={handlePrev}
                                    _hover={{ bg: "rgba(200,200,200,0.5)" }}
                                >
                                    <ChevronLeftIcon boxSize={8} color="white" />
                                </Button>
                                <Button
                                    variant="none"
                                    position="absolute"
                                    top="50%"
                                    right="0"
                                    p={0}
                                    transform="translateY(-50%)"
                                    borderRadius={"50%"}
                                    zIndex={20}
                                    onClick={handleNext}
                                    _hover={{ bg: "rgba(200,200,200,0.5)" }}
                                >
                                    <ChevronRightIcon boxSize={8} color="white" />
                                </Button>
                            </>
                        )}

                        <Flex
                            position="absolute"
                            w={"100%"}
                            minW={"100%"}
                            bottom={["3vw", "1vw"]}
                            px={["3vw", "1.5vw"]}
                            align={"center"}
                            justify={"space-between"}
                        >
                            {images.length > 1 ? <Button
                                variant="none"
                                p={0}
                                m={0}
                                w={["19px", "19px", "19px", "1.46vw"]}
                                minW={["19px", "19px", "19px", "1.46vw"]}
                            >
                                <FlipIcon
                                    width={"100%"}
                                    height={[
                                        "24px",
                                        "24px",
                                        "24px",
                                        "1.80vw"
                                    ]}
                                    stroke={"primary_1"}
                                />
                            </Button> : <Box></Box>}
                            {/* Empty Box for Alignmnet purpose */}
                            {images.length > 1 && (
                                <Flex
                                    // position="absolute"
                                    // bottom={["3vw", "2vw"]}
                                    // left={["3vw", "2vw"]}
                                    flex={1}
                                    zIndex={10}
                                    gap={["2vw", "0.5vw"]}
                                    justify={"center"}
                                >
                                    {images.map((_, index) => (
                                        <Box
                                            key={index}
                                            w={["3vw", "1vw"]}
                                            h={["3vw", "1vw"]}
                                            bg={index === currentIndex ? "blue.500" : "gray.300"}
                                            borderRadius="full"
                                            cursor="pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleIndicatorClick(index);
                                            }}
                                        />
                                    ))}
                                </Flex>
                            )}
                            <Button
                                variant="none"
                                // position="absolute"
                                // bottom={["3vw", "1vw"]}
                                // right={["3vw", "1.5vw"]}
                                w={["19px", "19px", "19px", "1.46vw"]}
                                minW={["19px", "19px", "19px", "1.46vw"]}
                                p={0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDxCardMode("normal");
                                }}
                            >
                                <Icon
                                    as={CloseIcon}
                                    w="100%"
                                    h={["24px", "24px", "24px", "1.4vw"]}
                                    color="primary_1"
                                />
                            </Button>
                        </Flex>
                    </Box>
                ) : (
                    <Flex w={["100%", "314px", "314px", "25vw"]}
                        minW={["90vw", "314px", "314px", "25vw"]}
                        h={["514px", "514px", "514px", "36vw"]}
                        minH={["514px", "514px", "514px", "36vw"]}
                        borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                        cursor="normal"
                        align={"center"}
                        justify={"center"}
                        bg="rgba(17,17,17,0.5)"
                    >
                        <Flex
                            w="100%"
                            h="100%"
                            flexDirection="column"
                            alignItems="center"
                            justify="center"
                            bg="rgba(17,17,17,0.5)"
                            position="absolute"
                            borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                        >
                            <Spinner
                                thickness="3px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="blue.500"
                                size="xl"
                            />
                            <Text color="white" mt={3}>
                                Uploading...
                            </Text>
                        </Flex>
                    </Flex>
                )
            }
            backContent={isAddSlide || !currentImage?.caption || blockImageLoading
                ? null
                : (
                    <Flex
                        flexDirection={"column"}
                        pt={["23px", "23px", "23px", "1.67vw"]}
                        bg="white"
                        w={"100%"}
                        h={"100%"}
                        borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
                        position={"relative"}
                        justifyContent={"space-between"}
                    >
                        <Box
                            px={["18px", "18px", "18px", "1.4vw"]}
                            overflowY={"scroll"}
                            pr={[2, 2]}
                            pb={["48px", "48px", "48px", "4.17vw"]}
                        >
                            <Text
                                fontFamily={"raleway"}
                                fontSize={["13px", "13px", "13px", , "0.97vw"]}
                                lineHeight={["15px", "15px", "15px", "1.25vw"]}
                                color={"#111111"}
                                textAlign={"left"}
                                whiteSpace="pre-wrap"
                                dangerouslySetInnerHTML={{
                                    __html: currentImage?.caption || '',
                                }}
                            />
                        </Box>
                        <Flex
                            position="absolute"
                            w={"100%"}
                            bottom={["3vw", "1vw"]}
                            px={["3vw", "1.5vw"]}
                            align={"center"}
                            justify={"space-between"}
                        >
                            {images.length > 1 ? <Button
                                variant="none"
                                p={0}
                                m={0}
                                minW={["19px", "19px", "19px", "1.46vw"]}
                            >
                                <FlipIcon
                                    width={"100%"}
                                    height={[
                                        "24px",
                                        "24px",
                                        "24px",
                                        "1.80vw"
                                    ]}
                                    stroke={"primary_1"}
                                />
                            </Button> : <Box></Box>}
                            {/* Empty Box for Alignmnet purpose */}

                            <Button
                                variant="none"
                                p={0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDxCardMode("normal");
                                }}
                            >
                                <Icon
                                    as={CloseIcon}
                                    w="100%"
                                    h={["24px", "24px", "24px", "1.80vw"]}
                                    color="primary_1"
                                />
                            </Button>
                        </Flex>
                    </Flex>
                )}
        />
    );
};

export default DxCardCarousel;
