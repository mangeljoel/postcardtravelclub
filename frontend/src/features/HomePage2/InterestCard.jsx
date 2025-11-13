import { Box, Text, HStack, VStack } from '@chakra-ui/react';

const InterestCard = ({ name, stats }) => {
    // Capitalize the first letter of each word
    const formattedName = name
        ?.toLowerCase()
        ?.replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <Box
            maxW={["full", "320px"]}
            minW={["full", "320px"]}
            maxH="180px"
            minH="180px"
            pos="relative"
            borderRadius="2xl"
            bg="blue.400"
            p={8}
            style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
        >
            {/* Title */}
            <Text
                fontSize="3xl"
                fontFamily="raleway"
                fontWeight={400}
                color="white"
                mb={6}
                lineHeight="shorter"
            >
                {formattedName}
            </Text>

            {/* Statistics Section */}
            <HStack spacing={6} pos="absolute" bottom={3}>
                {Object.entries(stats).map(([key, value]) => (
                    <VStack key={key} align="start" spacing={0}>
                        <Text
                            fontSize="2xl"
                            fontWeight="normal"
                            fontStyle={"italic"}
                            color="white"
                            fontFamily="lora"
                            lineHeight="shorter"
                        >
                            {value}
                        </Text>
                        <Text
                            fontSize={["11px", "xs"]}
                            fontWeight="medium"
                            color="white"
                            fontFamily="raleway"
                            textTransform="uppercase"
                            letterSpacing="wide"
                            opacity={0.9}
                        >
                            {key}
                        </Text>
                    </VStack>
                ))}
            </HStack>
        </Box>
    );
};

export default InterestCard;
