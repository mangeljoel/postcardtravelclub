import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Divider, Flex, HStack, List, ListItem, Text, useBreakpointValue, Wrap, WrapItem } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

const RouteFilterExps = ({ filterData, switchFilter }) => {
    const router = useRouter()
    const [countryRegionMap, setCountryRegionMap] = useState({})

    useEffect(() => {
        const selectedJson = filterData["countries"]

        // const result = filterByLevels(selectedJson, [null, null, null])
        // const result = Object.fromEntries(
        //     Object.entries(selectedJson).map(([country, regions]) => [
        //         country,
        //         // ["Delhi", "Karnataka", "Maharashtra", "Tamil Nadu", "Himachal Pradesh", "Kashmir", "Punjab", "Uttarakhand", "Uttar Pradesh", "Rajasthan", "Gujarat", "Madhya Pradesh", "Haryana", "Bihar", "Odisha", "Telangana", "Andhra Pradesh", "Kerala"]
        //         Object.keys(regions)
        //     ])
        // );
        // const result = {
        //     "India": ["Ladakh", "Karnataka", "Himachal Pradesh", "Kashmir"]
        // }
        const result = {
            "Morocco": []
        }
        // console.log("result", result)
        setCountryRegionMap(result)
        // if (Object.keys(result).length == 4) {
        //     if (!selectedCountry) setCountries(result.level1)
        //     setRegions(result.level2)
        // } else if (Object.keys(result).length == 3) {
        //     if (!selectedRegion) setRegions(result.level1)
        // }
    }, [filterData])

    return (
        <>
            <Box mb={4} w={"90%"}>
                {/* {Object.keys(countryRegionMap).length > 0 && (
                    <Accordion
                        allowMultiple
                        defaultIndex={Object.keys(countryRegionMap).map((_, index) => index)}
                    >
                        {Object.entries(countryRegionMap).map(([country, regions]) => (
                            <AccordionItem key={country}>
                                <h2>
                                    <AccordionButton>
                                        <AccordionIcon w={12} />
                                        <Box flex="1" textAlign="left" fontWeight="bold" fontSize="xl">
                                            <HStack>
                                                <span>{country}</span>
                                                <ExternalLinkIcon onClick={(e) => {
                                                    e.stopPropagation(); // Prevent accordion from toggling
                                                    const query = { ...router.query, country };
                                                    delete query.region; // Remove region when country changes

                                                    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
                                                    switchFilter()
                                                }} />
                                            </HStack>
                                        </Box>
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel py={8} pl={14}>
                                    <Wrap spacing="16px">
                                        {regions.map((region) => (
                                            <WrapItem key={region}>
                                                <Button
                                                    variant="none"
                                                    color="#111111"
                                                    border={"1px"}
                                                    fontSize={["16px", "20px"]}
                                                    cursor={"pointer"}
                                                    boxShadow={"none"}
                                                    borderColor="#111111"
                                                    bg={"transparent"}
                                                    borderRadius="full"
                                                    size="md"
                                                    px={6}
                                                    py={8}
                                                    onClick={() => {
                                                        const query = { ...router.query, region, country };
                                                        router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
                                                        switchFilter()
                                                    }}
                                                >
                                                    {region}
                                                </Button>
                                            </WrapItem>
                                        ))}
                                    </Wrap>
                                </AccordionPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )} */}
                {Object.keys(countryRegionMap).length > 0 && (() => {
                    let counter = 0;
                    const bgColors = ["#8da49c", "#9ca68e", "#c18563", "#adb0a7", "#cdbca8"];
                    const colors = ["#1c281e", "#d9d9bf", "#fff9dc", "#1c281e", "#65491a"];
                    return (
                        <>
                            {Object.entries(countryRegionMap).map(([country, regions]) => (
                                <Box
                                    key={country}
                                    w="80%"
                                    minH="20vh"
                                    // bg="#111111"
                                    // opacity="90%"
                                    borderRadius="30"
                                    mx="auto"
                                    my={8}
                                    p={8}
                                // backgroundImage={"/assets/temp3.jpg"}
                                // backgroundSize="cover"
                                // backgroundPosition="center"
                                // backgroundRepeat="no-repeat"
                                >
                                    <Text
                                        // color="#EFE9E4"
                                        color={"#111111"}
                                        fontFamily="lora"
                                        fontStyle="italic"
                                        fontSize={[42]}
                                        fontWeight={"bold"}
                                        textAlign="left"
                                        textShadow="4px 4px 8px rgba(0, 0, 0, 0.3)"
                                    >
                                        {country}
                                    </Text>

                                    {regions?.length > 0 && (
                                        <Flex flexWrap="wrap" mt={12} gap={8} >
                                            {regions.map((region, index) => {
                                                const currentIndex = counter % 5;
                                                counter++;

                                                return (
                                                    <Flex
                                                        key={region}
                                                        position="relative"
                                                        bg={bgColors[currentIndex]}
                                                        color={colors[currentIndex]}
                                                        w={[52]}
                                                        h={[60]}
                                                        alignItems="flex-end"
                                                        justifyContent="center"
                                                        borderRadius="2xl"
                                                        overflow="hidden"
                                                        fontWeight="semibold"
                                                        textAlign="center"
                                                        fontSize="xl"
                                                        fontFamily="raleway"
                                                        backgroundImage={`url(/assets/temp${currentIndex + 1}-Photoroom.png)`}
                                                        backgroundSize="70%"
                                                        backgroundPosition="center 20%"
                                                        backgroundRepeat="no-repeat"
                                                        boxShadow="17px 21px 15px -2px rgba(0,0,0,0.1)"
                                                    >
                                                        {/* Overlay */}
                                                        <Box
                                                            position="absolute"
                                                            top="0"
                                                            left="0"
                                                            right="0"
                                                            bottom="0"
                                                            bg="rgba(0, 0, 0, 0.1)" // black overlay with opacity
                                                            zIndex="1"
                                                        />

                                                        {/* Region text */}
                                                        <Text
                                                            position="relative"
                                                            zIndex="2"
                                                            // color={colors[index % 5]}
                                                            color={"white"}
                                                            // textShadow="2px 2px 6px rgba(0,0,0,0.5)"
                                                            px={2}
                                                            py={6}
                                                            textTransform="uppercase"
                                                        >
                                                            {region}
                                                        </Text>
                                                        {/* <Text
                                                        position="relative"
                                                        zIndex="2"
                                                        color="white"
                                                        px={2}
                                                        py={6}
                                                        textTransform="uppercase"
                                                        fontWeight="bold"
                                                        fontSize="2xl"
                                                        textShadow="0 0 4px rgba(255, 255, 255, 0.6), 0 0 6px rgba(255, 255, 255, 0.4)"
                                                    >
                                                        {region}
                                                    </Text> */}
                                                    </Flex>
                                                );
                                            })}
                                        </Flex>
                                    )}
                                </Box>
                            ))}
                        </>
                    )
                })()}

            </Box >
        </>
    )
}

export default RouteFilterExps