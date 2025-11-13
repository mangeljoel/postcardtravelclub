import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

export const CoverSection = React.memo(({ data }) => (
    <Box
        w="100%"
        minH={["181.11vw", "50.4vw"]}
        px={["5.56vw", "2.22vw"]}
        mt={["6.94vw", "2.22vw"]}
        mb={["15.55vw", "5vw"]}
    >
        <Box
            w="100%"
            h="100%"
            bg="#111111"
            borderRadius={["4.167vw", "2.08vw"]}
            position="relative"
        >
            <ChakraNextImage
                borderTopRadius={["4.167vw", "2.08vw"]}
                noLazy
                priority
                src={data?.coverImage?.url}
                w="100%"
                h={["152.33vw", "42.74vw"]}
                objectFit="cover"
                alt={`${data?.user?.fullName} coverImage`}
            />

            <Box
                w="100%"
                h={["152.33vw", "42.74vw"]}
                position="absolute"
                top={0}
                left={0}
                pl={["8.33vw", "6.46vw"]}
                pr={["6.67vw", "6.11vw"]}
                bgGradient="linear(to-t, #111111 2%, transparent 50%)"
                borderTopRadius={["4.167vw", "2.08vw"]}
            >
                <Flex
                    w="100%"
                    h="100%"
                    flexDirection="column"
                    justify="flex-end"
                    borderRadius={["4.167vw", "2.08vw"]}
                >
                    {/* Desktop version */}
                    <Flex
                        display={{ base: "none", sm: "flex" }}
                        flexDirection="column"
                        gap="1vw"
                    >
                        <Text
                            maxW="55.76vw"
                            fontSize="5vw"
                            lineHeight="4.72vw"
                            color="white"
                            fontFamily="lora"
                            fontStyle="italic"
                        >
                            {data?.name}
                        </Text>
                        <Text
                            maxW="55.76vw"
                            fontSize="4.58vw"
                            lineHeight="4.72vw"
                            color="white"
                            fontFamily="raleway"
                        >
                            {`${data?.title}, ${data?.country?.name}`}
                        </Text>
                    </Flex>

                    {/* Mobile version */}
                    <Flex
                        display={{ base: "flex", sm: "none" }}
                        flexDirection="column"
                        mt="auto"
                        gap="6.67vw"
                    >
                        <Flex flexDirection="column" gap="1vw">
                            <Text
                                w="100%"
                                fontSize="8.2vw"
                                lineHeight="8.88vw"
                                color="white"
                                fontFamily="lora"
                                fontStyle="italic"
                            >
                                {data?.name}
                            </Text>
                            <Text
                                w="100%"
                                fontSize="7.78vw"
                                lineHeight="8.88vw"
                                color="white"
                                fontFamily="raleway"
                            >
                                {`${data?.title}, ${data?.country?.name}`}
                            </Text>
                        </Flex>
                        <Text
                            color="#EFE9E4"
                            fontFamily="raleway"
                            fontWeight={400}
                            fontSize="3.89vw"
                            lineHeight="5vw"
                        >
                            {data?.tagLine}
                        </Text>
                        <Box h="2.33vw" />
                    </Flex>

                    <Text
                        display={{ base: "none", sm: "flex" }}
                        color="#EFE9E4"
                        fontFamily="raleway"
                        fontWeight={400}
                        fontSize="1.87vw"
                        mt="3.26vw"
                    >
                        {data?.tagLine}
                    </Text>

                    <Box
                        h="2px"
                        mt={["2vw", "1.5vw"]}
                        w="100%"
                        bg="#EFE9E4"
                    />
                </Flex>
            </Box>

            {/* Quote section */}
            <Flex
                flexDirection="column"
                w="100%"
                color="#EFE9E4"
                alignItems="center"
                pl={["8.33vw", "6.46vw"]}
                pr={["6.67vw", "6.11vw"]}
                py={["6.67vw", "4vw"]}
            >
                <Text
                    w="100%"
                    mb={["4vw", "2vw"]}
                    textAlign="left"
                    color="#EFE9E4"
                    fontFamily="raleway"
                    fontWeight={400}
                    fontSize={["3.89vw", "1.87vw"]}
                >
                    <Icon as={RiDoubleQuotesL} /> {data?.quotes?.quoteText} <Icon as={RiDoubleQuotesR} />
                </Text>
                <Text
                    color="#EFE9E4"
                    fontFamily="lora"
                    fontStyle="italic"
                    fontWeight={400}
                    fontSize={["3.89vw", "1.87vw"]}
                    w="100%"
                    textAlign="right"
                >
                    - {data?.quotes?.quoteAuthor}
                </Text>
            </Flex>
        </Box>
    </Box>
));