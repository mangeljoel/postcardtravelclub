import {Box, Flex, Text, Icon, VStack  } from "@chakra-ui/react";
import React, { useState } from "react";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

const TestimonialCard = ({ data }) => {
    const [readMore, setReadMore] = useState(false);

    return (
       <Flex
            flexDirection={"column"}
    w={["85vw", "380px"]}
            minH={["350px", "480px"]}


    borderRadius="16px"
    mx="auto"
    bg="white"
    boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
    overflow="hidden"
    transition="all 0.3s ease"
    _hover={{
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
        transform: "translateY(-4px)"
    }}
>
    {/* Quote Section */}
    <Box
        flex="1"
        p={["24px", "32px"]}
        overflowY="auto"
        className="no-scrollbar"
        position="relative"
    >
        <Icon
            as={RiDoubleQuotesL}
            w={["32px", "40px"]}
            h={["32px", "40px"]}
            color="brand.500"
            opacity={0.2}
            position="absolute"
            top="20px"
            left="20px"
        />

        <Text
            fontSize={["15px", "16px"]}
            fontFamily="raleway"
            fontWeight={400}
            lineHeight="1.7"
            color="gray.700"
            pt="24px"
        >
            {data?.message}
        </Text>

        {/* Fade effect at bottom */}
        <Box
            position="sticky"
            bottom={0}
            left={0}
            width="100%"
            height="40px"
            background="linear-gradient(to top, white, transparent)"
            pointerEvents="none"
        />
    </Box>

    {/* Author Section */}
    <Box
        borderTop="1px solid"
        borderColor="gray.100"
        bg="gray.50"
        px={["24px", "32px"]}
        py={["10px", "24px"]}
    >
        <VStack align="flex-start" spacing={1}>
            <Text
                fontSize={["16px", "17px"]}
                fontFamily="lora"
                fontWeight={600}
                color="gray.900"
            >
                {data?.name}
            </Text>
            <Text
                fontSize={["13px", "14px"]}
                fontFamily="raleway"
                fontWeight={500}
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="0.5px"
            >
                Concierge Member
            </Text>
        </VStack>
    </Box>
</Flex>
    );
};

export default TestimonialCard;
