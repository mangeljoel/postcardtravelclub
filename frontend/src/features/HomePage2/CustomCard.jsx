import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
import { useState, useEffect } from "react";

const CustomCard = ({ story }) => {
    const [imageSrc, setImageSrc] = useState("");
    // Resolve the correct image source
    const rawImage =
        story?.imageUrl ||
        story?.coverImage?.url ||
        "";

    const fallbackImage =
        "https://images.postcard.travel/postcardv2/como_shambhala_estate_enjoy_a_scenic_nature_walk_on_the_tjampuhan_ridge_7d490c0cd2.jpg";

    useEffect(() => {
        const resolveImage = async () => {
            // Priority 1: Use rawImage if it's a valid URL (not local path)
            const isLocalImage = rawImage.startsWith("/assets/") || rawImage.startsWith("/images/") || rawImage.trim() === "";
            if (!isLocalImage && rawImage) {
                setImageSrc(rawImage);
                return;
            }

            // Priority 2: Check if /assets/homepage/featured/{story.name} exists
            if (story?.name) {
                const storyNameLower = story.name.toLowerCase()
                const localPath = `/assets/homepage/featured/${storyNameLower}.jpg`;

                try {
                    // Check if the image exists
                    const response = await fetch(localPath, { method: 'HEAD' });
                    if (response.ok) {
                        setImageSrc(localPath);
                        return;
                    }
                } catch (error) {
                    // Image doesn't exist, continue to fallback
                }
            }

            // Priority 3: Use fallback image
            setImageSrc(fallbackImage);
        };

        resolveImage();
    }, [story, rawImage, fallbackImage]);

    return (
        <Box
            w={["85.9vw", "384px", "384px", "354px", "384px"]}
            h={["auto", "460px"]}
            minW={["85.9vw", "384px", "384px", "354px", "384px"]}
            minH={["280px", "420px"]}
            borderRadius="3xl"
            maxH="480px"
            overflow="hidden"
            bg="gray.900"
            position="relative"
            style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
        >
            <Box position="absolute" top="12px" left="12px" zIndex="2">
                <ChakraNextImage
                    src="/assets/images/p_stamp_trans.png"
                    alt="stamp"
                    w={["50px", "80px"]}
                    h={["50px", "80px"]}
                    objectFit="contain"
                />
            </Box>
            {/* Image Section */}
            <Box position="relative" h="70%">
                {imageSrc && (
                    <ChakraNextImage
                        src={imageSrc}
                        alt={story?.name || "Experience"}
                        objectFit="cover"
                        w="100%"
                        h="100%"
                    />
                )}
            </Box>

            {/* Content Section */}
            <VStack align="stretch" p={6} spacing={2} h="30%">
                <VStack align="start" spacing={1}>
                    <Text
                        fontSize="2xl"
                        fontWeight="normal"
                        color="white"
                        textTransform={"capitalize"}
                        lineHeight="shorter"
                    >
                        {story.name}
                    </Text>
                </VStack>


                {/* Statistics Section */}
                {story?.stats && (
                    <HStack
                        spacing={8}
                        pt={2}
                        justifyContent={
                            Object.keys(story.stats).length > 2 ? "space-between" : "flex-start"
                        }
                    >
                        {Object.entries(story.stats).map(([key, value]) => (
                            <VStack key={key} align="start" spacing={0}>
                                <Text fontSize="2xl" fontFamily="lora" fontWeight="normal" fontStyle="italic" color="white" lineHeight="shorter">
                                    {value}
                                </Text>
                                <Text
                                    fontSize={["11px", "xs"]}
                                    fontWeight="medium"
                                    color="primary_1"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                >
                                    {key}
                                </Text>
                            </VStack>
                        ))}
                    </HStack>

                )}
            </VStack>
        </Box>
    );
};

export default CustomCard;