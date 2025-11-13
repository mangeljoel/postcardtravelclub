import { Button, Flex, Image, Link, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { FlipIcon } from '../../styles/ChakraUI/icons';

const DeckCard = ({ data }) => {
    const [coverImage, setCoverImage] = useState('')
    const firstCoverImage = data.itinerary_block?.find(
        block => block.dx_card?.coverImage?.url
    )?.dx_card.coverImage;
    return (
        <Flex
            w={["100%", "314px", "314px", "25vw"]}
            minW={["90vw", "314px", "314px", "25vw"]}
            h={["500px", "500px", "500px", "34vw"]}
            minH={["500px", "500px", "500px", "34vw"]}
            borderRadius={["22.5px", "22.5px", "22.5px", "1.563vw"]}
            flexDirection={"column"}
            bg={"white"}
            position={"relative"}
        >
            <Image
                src={firstCoverImage?.url}
                h={"21.53vw"}
                minH={"295px"}
                objectFit={"cover"}
                borderTopRadius={[
                    "22.5px",
                    "22.5px",
                    "22.5px",
                    "1.563vw"
                ]}
                alt={"deck card"}
            />
            <Flex
                flexDirection={"column"}
                flex={1}
                p={["20px", "20px", "20px", "1.53vw"]}
                pb={["21px", "21px", "21px", "0.7vw"]}
            >
                <Flex gap={2} justify={"space-between"}>
                    <Text
                        fontFamily={"raleway"}
                        fontSize={["17px", "17px", "17px", "1.25vw"]}
                        lineHeight={["22px", "22px", "22px", "1.67vw"]}
                        fontWeight={500}
                        textAlign={"left"}
                    >
                        {(data?.title?.trim())}
                    </Text>
                </Flex>

                <Flex justify={"space-between"}>
                    <Text
                        fontFamily={"raleway"}
                        fontSize={["14px", "13px", "13px", "0.94vw"]}
                        lineHeight={["22px", "22px", "22px", "1.67vw"]}
                        fontWeight={500}
                        mt={"2%"}
                        color={"primary_3"}
                        textAlign={"left"}
                    >
                        {data?.destination_expert?.name}
                    </Text>
                </Flex>

                <Flex
                    mt="auto"
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    pb={["20px", "20px", "20px", "1.53vw"]}
                >
                    <Flex
                        gap={["10px", "10px", "10px", "0.83vw"]}
                        maxW={["12vw", "auto"]}
                        alignItems={"center"}
                    >
                        <Button
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
                        </Button>
                    </Flex>
                    <Button
                        variant="none"
                        as={Link}
                        href={`/postcard-deck/${data?.slug}`}
                        // p={0}
                        m={0}
                        minW={["19px", "19px", "19px", "1.46vw"]}
                        border={"2px"}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        color={"primary_1"}
                    >
                        View Deck
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default DeckCard