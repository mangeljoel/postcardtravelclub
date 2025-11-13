import {
    Box,
    Button,
    Divider,
    Flex,
    Image,
    Link,
    Text
} from "@chakra-ui/react";
import React, { useContext } from "react";
import FlipCard1 from "../../../patterns/FlipCard1";
import { FlipIcon } from "../../../styles/ChakraUI/icons";
import { LinkIcon } from "@chakra-ui/icons";
import AppContext from "../../AppContext";
import { useSignupModal } from "../../SignupModalContext";
import { useRouter } from "next/router";

const MembershipSection = () => {
    const { profile } = useContext(AppContext);
    const { openLoginModal } = useSignupModal();
    const router = useRouter();

    return (
        <Flex
            flexDirection={["column", "row"]}
            // px={["5.55vw", "8.65vw"]}
            // px={["5.55vw", "1.56vw"]}
            // mx={["0", "8.65vw"]}
            px={["5.55vw", "5.65vw"]}
            gap={["3em"]}
            alignItems={"center"}
        >
            {/* <Text
                as="span"
                fontSize={["6.4vw", "3.02vw"]}
                lineHeight={["6.67vw", "3.33vw"]}
                fontFamily="raleway"
                fontWeight={500}
                color={"primary_3"}
                textAlign={"start"}
                w={"100%"}
            >
                Join the <Text as="span" fontFamily={"lora"} fontStyle={"italic"}>Postcard Travel Club</Text> and discover the world of conscious luxury travel and lifestyle.
            </Text> */}

            <Flex gap={8} flexWrap={"wrap"} w={"100%"}>
                <FlipCard1
                    frontContent={
                        <>
                            <Flex
                                w={["100%", "314px", "314px", "26.21vw"]}
                                minW={["314px", "314px", "314px", "26.21vw"]}
                                borderRadius={["12px", "12px", "12px", "1vw"]}
                                flexDirection={"column"}
                                cursor={"default"}
                                bg={"white"}
                                position={"relative"}
                            >
                                <Image
                                    src={"/assets/images/p_stamp_trans.png"}
                                    pos={"absolute"}
                                    objectFit={"cover"}
                                    alt={"postcard"}
                                    top={["4.167vw", "1.5vw"]}
                                    right={["4.167vw", "1.37vw"]}
                                    w={["19.44vw", "4.95vw"]}
                                />
                                <Image
                                    src={"/assets/homepage/membership_1.jpg"}
                                    h={["16.53vw"]}
                                    minH={["55.55vw", "200px"]}
                                    objectFit={"cover"}
                                    borderTopRadius={[
                                        "12px",
                                        "12px",
                                        "12px",
                                        "1vw"
                                    ]}
                                    alt={"membership card"}
                                />
                                <Box
                                    w="100%"
                                    h={["16.53vw"]}
                                    minH={["55.55vw", "200px"]}
                                    pos="absolute"
                                    bgGradient="linear(to-t, #111111 0%, transparent 30%)"
                                >
                                    <Text
                                        pos="absolute"
                                        bottom="1.5"
                                        right="4"
                                        fontFamily="raleway"
                                        color="white"
                                        fontWeight="small"
                                        fontSize={"xs"}
                                    >
                                        Nimali Africa, Tanzania
                                    </Text>
                                </Box>
                                <Flex
                                    flexDirection={"column"}
                                    py={["6.94vw", "1.95vw"]}
                                    px={["8.33vw", "2.74vw"]}
                                >
                                    <Text
                                        fontFamily={"raleway"}
                                        fontSize={["6vw", "1.8vw"]}
                                        lineHeight={["7vw", "2.2vw"]}
                                        fontWeight={"bold"}
                                        textAlign={"left"}
                                        color={"primary_3"}
                                    >
                                        Postcard Travel Diary
                                    </Text>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontSize={["6vw", "1.8vw"]}
                                        lineHeight={["7vw", "2.2vw"]}
                                        fontWeight={"bold"}
                                        textAlign={"left"}
                                        color={"primary_3"}
                                    >
                                        {" "}
                                        &nbsp;
                                    </Text>

                                    <Text
                                        mt={["3.11vw", "1vw"]}
                                        fontFamily={"raleway"}
                                        fontSize={["3vw", "0.9vw"]}
                                        fontWeight={"bold"}
                                        color={"primary_1"}
                                    >
                                        FREE FOREVER!
                                        {/* USD 250 per year */}
                                    </Text>

                                    <Text
                                        fontSize={["4vw", "1.1vw"]}
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        mt={["3.11vw", "1vw"]}
                                        h={["26.67vw", "6.4vw"]}
                                    >
                                        Collect postcards of properties and
                                        experiences, and build your wish-list
                                        for conscious luxury travel.
                                    </Text>

                                    <Flex
                                        mt={["9.72vw", "2vw"]}
                                        h={["8.33vw", "2.1vw"]}
                                        w={"100%"}
                                        alignItems={"center"}
                                        justify={"space-between"}
                                    >
                                        <Flex
                                            gap={["1vw", "0.63vw"]}
                                            alignItems={"center"}
                                            justify={"flex-start"}
                                            w={"42%"}
                                            h={"100%"}
                                        >
                                            <Button
                                                variant="none"
                                                h={"100%"}
                                                p={0}
                                                m={0}
                                                minW={["20px", "1.42vw"]}
                                            >
                                                <FlipIcon
                                                    width={"100%"}
                                                    height={"100%"}
                                                    stroke={"primary_1"}
                                                />
                                            </Button>
                                            <Text
                                                w={["22.22vw", "6vw"]}
                                                fontFamily={"raleway"}
                                                fontSize={["3.33vw", "0.89vw"]}
                                                color={"primary_1"}
                                                fontWeight={"bold"}
                                            >
                                                PRODUCT BENEFITS
                                            </Text>
                                        </Flex>

                                        {!profile && (
                                            <Button
                                                w={"fit-content"}
                                                h={"100%"}
                                                variant={"none"}
                                                bg={"primary_1"}
                                                color={"white"}
                                                fontSize={["3.61vw", "0.9vw"]}
                                                px={["5.55vw", "1.21vw"]}
                                                borderRadius={["md"]}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openLoginModal();
                                                }}
                                            >
                                                SIGN UP!
                                            </Button>
                                        )}
                                    </Flex>
                                </Flex>
                            </Flex>
                        </>
                    }
                    backContent={
                        <>
                            <Flex
                                flexDirection={"column"}
                                justify={"space-between"}
                                w={"100%"}
                                h={"100%"}
                                bg={"white"}
                                borderRadius={["12px", "12px", "12px", "1vw"]}
                                cursor={"default"}
                            >
                                <Flex
                                    bg={"primary_3"}
                                    color={"white"}
                                    borderTopRadius={[
                                        "12px",
                                        "12px",
                                        "12px",
                                        "1vw"
                                    ]}
                                    h={["16.67vw", "4.5vw"]}
                                    px={["9.72vw", "2.74vw"]}
                                    fontSize={["4.167vw", "1.21vw"]}
                                    alignItems={"center"}
                                    fontWeight={"bold"}
                                    fontFamily={"raleway"}
                                >
                                    PRODUCT BENEFITS
                                </Flex>

                                <Flex
                                    flex={1}
                                    flexDirection={"column"}
                                    py={["6.94vw", "2.1vw"]}
                                    px={["9.72vw", "2.74vw"]}
                                >
                                    <Flex
                                        h={"100%"}
                                        flexDirection={"column"}
                                        justify={"space-between"}
                                    >
                                        <Flex
                                            flexDirection={"column"}
                                            gap={["4.72vw", "1.15vw"]}
                                        >
                                            <Text
                                                as={Link}
                                                href={"/experiences"}
                                                fontSize={["3.5vw", "1vw"]}
                                                fontFamily={"raleway"}
                                                color={"primary_1"}
                                                fontWeight={"500"}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                cursor={"pointer"}
                                            >
                                                Postcard Experiences{" "}
                                                <Text color="black" as="span">
                                                    - Search the global
                                                    directory of postcard
                                                    experiences curated by
                                                    partner brands.{" "}
                                                </Text>
                                            </Text>
                                            <Text
                                                as={Link}
                                                href={"/stays"}
                                                fontSize={["3.5vw", "1vw"]}
                                                fontFamily={"raleway"}
                                                color={"primary_1"}
                                                fontWeight={"500"}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                cursor={"pointer"}
                                            >
                                                Postcard Stays{" "}
                                                <Text color="black" as="span">
                                                    - Discover postcards from a
                                                    curated collection of
                                                    boutique property partners.
                                                </Text>
                                            </Text>
                                            <Text
                                                as={Link}
                                                href={"/destination-experts"}
                                                fontSize={["3.5vw", "1vw"]}
                                                fontFamily={"raleway"}
                                                color={"primary_1"}
                                                fontWeight={"500"}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                cursor={"pointer"}
                                            >
                                                Postcard Destination Experts{" "}
                                                <Text color="black" as="span">
                                                    - Explore postcard
                                                    storyboards with curated
                                                    experiences offered by
                                                    partner experts.
                                                </Text>
                                            </Text>
                                            <Text
                                                as={Link}
                                                fontSize={["3.5vw", "1vw"]}
                                                fontFamily={"raleway"}
                                                color={"primary_1"}
                                                fontWeight={"500"}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!profile) {
                                                        localStorage.setItem(
                                                            "navigateToDiary",
                                                            true
                                                        );
                                                        openLoginModal();
                                                    } else
                                                        router.push(
                                                            "/" + profile?.slug
                                                        );
                                                }}
                                                cursor={"pointer"}
                                            >
                                                Postcard Travel Diary{" "}
                                                <Text color="black" as="span">
                                                    - Collect postcards, build
                                                    your travel wish-list and
                                                    save your memories in one
                                                    place.
                                                </Text>
                                            </Text>
                                            {/* <Text fontSize={["3.5vw", "1vw"]} fontFamily={"raleway"} fontWeight={600}>Postcard Maps - coming soon</Text>
                                            <Text fontSize={["3.5vw", "1vw"]} fontFamily={"raleway"} fontWeight={600}>Postcard Webinars - coming soon</Text> */}
                                        </Flex>
                                        <Flex
                                            flexDirection={"column"}
                                            gap={["4.167vw", "1.93vw"]}
                                        >
                                            <Text
                                                fontFamily={"raleway"}
                                                fontSize={["4.167vw", "1.3vw"]}
                                                fontWeight={"bold"}
                                                color={"primary_1"}
                                            >
                                                FREE FOREVER!
                                            </Text>
                                        </Flex>
                                    </Flex>

                                    <Flex
                                        mt={["5.55vw", "2.2vw"]}
                                        h={["8.33vw", "2.1vw"]}
                                        w={"100%"}
                                        alignItems={"center"}
                                        justify={"space-between"}
                                    >
                                        <Button
                                            w={"10%"}
                                            h={"100%"}
                                            variant="none"
                                            p={0}
                                            m={0}
                                            minW={["5.55vw", "1.42vw"]}
                                        >
                                            <FlipIcon
                                                width={"100%"}
                                                height={"100%"}
                                                stroke={"primary_1"}
                                            />
                                        </Button>

                                        {!profile && (
                                            <Button
                                                variant={"none"}
                                                bg={"primary_1"}
                                                color={"white"}
                                                w={"fit-content"}
                                                h={"100%"}
                                                fontSize={["3.61vw", "0.9vw"]}
                                                px={["5.55vw", "1.21vw"]}
                                                borderRadius={["md"]}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openLoginModal();
                                                }}
                                            >
                                                SIGN UP!
                                            </Button>
                                        )}
                                    </Flex>
                                </Flex>
                            </Flex>
                        </>
                    }
                />

                <FlipCard1
                    frontContent={
                        <>
                            <Flex
                                w={["100%", "314px", "314px", "26.21vw"]}
                                minW={["314px", "314px", "314px", "26.21vw"]}
                                borderRadius={["12px", "12px", "12px", "1vw"]}
                                flexDirection={"column"}
                                cursor={"default"}
                                bg={"white"}
                                position={"relative"}
                            >
                                <Image
                                    src={"/assets/images/p_stamp_trans.png"}
                                    pos={"absolute"}
                                    objectFit={"cover"}
                                    alt={"postcard"}
                                    top={["4.167vw", "1.5vw"]}
                                    right={["4.167vw", "1.37vw"]}
                                    w={["19.44vw", "4.95vw"]}
                                />
                                <Image
                                    src={"/assets/homepage/membership_2.jpg"}
                                    h={["16.53vw"]}
                                    minH={["55.55vw", "200px"]}
                                    objectFit={"cover"}
                                    borderTopRadius={[
                                        "12px",
                                        "12px",
                                        "12px",
                                        "1vw"
                                    ]}
                                    alt={"membership card"}
                                />
                                <Box
                                    w="100%"
                                    h={["16.53vw"]}
                                    minH={["55.55vw", "200px"]}
                                    pos="absolute"
                                    bgGradient="linear(to-t, #111111 0%, transparent 30%)"
                                >
                                    <Text
                                        pos="absolute"
                                        bottom="1.5"
                                        right="4"
                                        fontFamily="raleway"
                                        color="white"
                                        fontWeight="small"
                                        fontSize={"xs"}
                                    >
                                        Destino Mio, Mexico
                                    </Text>
                                </Box>
                                <Flex
                                    flexDirection={"column"}
                                    py={["6.94vw", "1.95vw"]}
                                    px={["8.33vw", "2.74vw"]}
                                >
                                    <Text
                                        fontFamily={"raleway"}
                                        fontSize={["6vw", "1.8vw"]}
                                        lineHeight={["7vw", "2.2vw"]}
                                        fontWeight={"bold"}
                                        textAlign={"left"}
                                        color={"primary_3"}
                                    >
                                        Postcard Travel Concierge Membership
                                    </Text>

                                    <Text
                                        mt={["3.11vw", "1vw"]}
                                        fontFamily={"raleway"}
                                        fontSize={["3vw", "0.9vw"]}
                                        fontWeight={"bold"}
                                        color={"primary_1"}
                                        // color={"transparent"}
                                    >
                                        INR 25,000 per year
                                    </Text>

                                    <Text
                                        fontSize={["4vw", "1.1vw"]}
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        mt={["3.11vw", "1vw"]}
                                        h={["26.67vw", "6.4vw"]}
                                    >
                                        Connect with your personal relationship
                                        manager for help with travel research,
                                        and introductions to partner properties
                                        and destination experts.
                                    </Text>

                                    <Flex
                                        mt={["9.72vw", "2vw"]}
                                        h={["8.33vw", "2.1vw"]}
                                        w={"100%"}
                                        alignItems={"center"}
                                        justify={"space-between"}
                                    >
                                        <Flex
                                            gap={["1vw", "0.63vw"]}
                                            alignItems={"center"}
                                            w={"42%"}
                                            h={"100%"}
                                        >
                                            <Button
                                                variant="none"
                                                h={"100%"}
                                                p={0}
                                                m={0}
                                                minW={["20px", "1.42vw"]}
                                            >
                                                <FlipIcon
                                                    width={"100%"}
                                                    height={"100%"}
                                                    stroke={"primary_1"}
                                                />
                                            </Button>
                                            <Text
                                                w={["22.22vw", "6vw"]}
                                                fontFamily={"raleway"}
                                                fontSize={["3.33vw", "0.89vw"]}
                                                color={"primary_1"}
                                                fontWeight={"bold"}
                                            >
                                                MEMBERSHIP BENEFITS
                                            </Text>
                                        </Flex>

                                        <Button
                                            as={Link}
                                            href={
                                                "https://form.typeform.com/to/hEPBut5I"
                                            }
                                            target="_blank"
                                            variant={"none"}
                                            bg={"primary_1"}
                                            color={"white"}
                                            w={"fit-content"}
                                            h={"100%"}
                                            fontSize={["3.61vw", "0.9vw"]}
                                            px={["5.55vw", "1.21vw"]}
                                            borderRadius={["md"]}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            APPLY NOW!
                                        </Button>
                                        {/* <Button variant={"none"} color={"primary_1"} border={"1px"} w={"fit-content"} h={"100%"} fontSize={["3.61vw", "0.9vw"]} px={["5.55vw", "1.21vw"]} borderRadius={["md"]}>COMING SOON</Button> */}
                                    </Flex>
                                </Flex>
                            </Flex>
                        </>
                    }
                    backContent={
                        <>
                            <Flex
                                flexDirection={"column"}
                                justify={"space-between"}
                                w={"100%"}
                                h={"100%"}
                                bg={"white"}
                                borderRadius={["12px", "12px", "12px", "1vw"]}
                                cursor={"default"}
                            >
                                <Flex
                                    bg={"primary_3"}
                                    color={"white"}
                                    borderTopRadius={[
                                        "12px",
                                        "12px",
                                        "12px",
                                        "1vw"
                                    ]}
                                    h={["16.67vw", "4.5vw"]}
                                    px={["9.72vw", "2.74vw"]}
                                    fontSize={["4.167vw", "1.21vw"]}
                                    alignItems={"center"}
                                    fontWeight={"bold"}
                                    fontFamily={"raleway"}
                                >
                                    MEMBERSHIP BENEFITS
                                </Flex>

                                <Flex
                                    flex={1}
                                    flexDirection={"column"}
                                    py={["6.94vw", "2.1vw"]}
                                    px={["9.72vw", "2.74vw"]}
                                >
                                    <Flex
                                        h={"100%"}
                                        flexDirection={"column"}
                                        justify={"space-between"}
                                    >
                                        <Flex
                                            flexDirection={"column"}
                                            gap={["2vw", "0.7vw"]}
                                        >
                                            <Text
                                                fontSize={["3.5vw", "1vw"]}
                                                fontFamily={"raleway"}
                                                fontWeight={500}
                                                color={"black"}
                                            >
                                                Unlock up to 15% off
                                                best-available rates from 250+
                                                boutique properties in 35+
                                                countries.
                                            </Text>
                                            <Box
                                                w={["11.11vw", "2.7vw"]}
                                                h={["1px", "1.5px"]}
                                                bg={"gray"}
                                            ></Box>

                                            <Text
                                                fontSize={["3.5vw", "1vw"]}
                                                fontFamily={"raleway"}
                                                fontWeight={500}
                                                color={"black"}
                                            >
                                                Complimentary 30 minutes Zoom
                                                calls with local destination
                                                experts in 15+ countries to
                                                offer ideas and advice for your
                                                travel plans.
                                            </Text>
                                            <Box
                                                w={["11.11vw", "2.7vw"]}
                                                h={["1px", "1.5px"]}
                                                bg={"gray"}
                                            ></Box>

                                            <Text
                                                fontSize={["3.5vw", "1vw"]}
                                                fontFamily={"raleway"}
                                                fontWeight={500}
                                                color={"black"}
                                            >
                                                Professional support to build a
                                                curated and customised itinerary
                                                with local experiences and
                                                stories.
                                            </Text>
                                            <Box
                                                w={["11.11vw", "2.7vw"]}
                                                h={["1px", "1.5px"]}
                                                bg={"gray"}
                                            ></Box>

                                            <Text
                                                fontSize={["3.5vw", "1vw"]}
                                                fontFamily={"raleway"}
                                                fontWeight={500}
                                                color={"black"}
                                            >
                                                Invitation to join the private
                                                Postcard Travel Concierge
                                                (WhatsApp group) for community
                                                updates and announcements.
                                            </Text>
                                        </Flex>
                                        <Flex
                                            flexDirection={"column"}
                                            gap={["4.167vw", "1.93vw"]}
                                        >
                                            <Text
                                                fontFamily={"raleway"}
                                                fontSize={["4.167vw", "1.3vw"]}
                                                fontWeight={"bold"}
                                                color={"primary_1"}
                                                // color={"transparent"}
                                            >
                                                INR 25,000 per year
                                            </Text>
                                        </Flex>
                                    </Flex>

                                    <Flex
                                        mt={["5.55vw", "2.2vw"]}
                                        h={["8.33vw", "2.1vw"]}
                                        w={"100%"}
                                        alignItems={"center"}
                                        justify={"space-between"}
                                    >
                                        <Button
                                            w={"10%"}
                                            h={"100%"}
                                            variant="none"
                                            p={0}
                                            m={0}
                                            minW={["5.55vw", "1.42vw"]}
                                        >
                                            <FlipIcon
                                                width={"100%"}
                                                height={"100%"}
                                                stroke={"primary_1"}
                                            />
                                        </Button>

                                        <Button
                                            as={Link}
                                            href={
                                                "https://form.typeform.com/to/hEPBut5I"
                                            }
                                            target="_blank"
                                            variant={"none"}
                                            bg={"primary_1"}
                                            color={"white"}
                                            w={"fit-content"}
                                            h={"100%"}
                                            fontSize={["3.61vw", "0.9vw"]}
                                            px={["5.55vw", "1.21vw"]}
                                            borderRadius={["md"]}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            APPLY NOW!
                                        </Button>
                                        {/* <Button variant={"none"} color={"primary_1"} border={"1px"} w={"fit-content"} h={"100%"} fontSize={["3.61vw", "0.9vw"]} px={["5.55vw", "1.21vw"]} borderRadius={["md"]}>COMING SOON</Button> */}
                                    </Flex>
                                </Flex>
                            </Flex>
                        </>
                    }
                />

                <FlipCard1
                    frontContent={
                        <>
                            <Flex
                                w={["100%", "314px", "314px", "26.21vw"]}
                                minW={["314px", "314px", "314px", "26.21vw"]}
                                borderRadius={["12px", "12px", "12px", "1vw"]}
                                flexDirection={"column"}
                                cursor={"default"}
                                bg={"white"}
                                position={"relative"}
                            >
                                <Image
                                    src={"/assets/images/p_stamp_trans.png"}
                                    pos={"absolute"}
                                    objectFit={"cover"}
                                    alt={"postcard"}
                                    top={["4.167vw", "1.5vw"]}
                                    right={["4.167vw", "1.37vw"]}
                                    w={["19.44vw", "4.95vw"]}
                                />
                                <Image
                                    src={"/assets/homepage/membership_3.jpg"}
                                    h={["16.53vw"]}
                                    minH={["55.55vw", "200px"]}
                                    objectFit={"cover"}
                                    borderTopRadius={[
                                        "12px",
                                        "12px",
                                        "12px",
                                        "1vw"
                                    ]}
                                    alt={"membership card"}
                                />
                                <Box
                                    w="100%"
                                    h={["16.53vw"]}
                                    minH={["55.55vw", "200px"]}
                                    pos="absolute"
                                    bgGradient="linear(to-t, #111111 0%, transparent 30%)"
                                >
                                    <Text
                                        pos="absolute"
                                        bottom="1.5"
                                        right="4"
                                        fontFamily="raleway"
                                        color="white"
                                        fontWeight="small"
                                        fontSize={"xs"}
                                    >
                                        Kamara House, South Africa
                                    </Text>
                                </Box>

                                <Flex
                                    flexDirection={"column"}
                                    py={["6.94vw", "1.95vw"]}
                                    px={["8.33vw", "2.74vw"]}
                                >
                                    <Text
                                        fontFamily={"raleway"}
                                        fontSize={["6vw", "1.8vw"]}
                                        lineHeight={["7vw", "2.2vw"]}
                                        fontWeight={"bold"}
                                        textAlign={"left"}
                                        color={"primary_3"}
                                    >
                                        Postcard Local City Circles Membership
                                    </Text>

                                    <Text
                                        mt={["3.11vw", "1vw"]}
                                        fontFamily={"raleway"}
                                        fontSize={["3vw", "0.9vw"]}
                                        fontWeight={"bold"}
                                        // color={"primary_1"}
                                        color={"transparent"}
                                    >
                                        INR 50,000 per year
                                    </Text>

                                    <Text
                                        fontSize={["4vw", "1.1vw"]}
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        mt={["4.44vw", "1vw"]}
                                        h={["26.67vw", "6.4vw"]}
                                    >
                                        Connect with a local community of
                                        like-minded members for curated pop-ups,
                                        day-trips and weekend getaways.
                                    </Text>

                                    <Flex
                                        mt={["9.72vw", "2vw"]}
                                        h={["8.33vw", "2.1vw"]}
                                        w={"100%"}
                                        alignItems={"center"}
                                        justify={"space-between"}
                                    >
                                        <Flex
                                            gap={["1vw", "0.63vw"]}
                                            alignItems={"center"}
                                            w={"42%"}
                                            h={"100%"}
                                        >
                                            <Button
                                                variant="none"
                                                h={"100%"}
                                                p={0}
                                                m={0}
                                                minW={["20px", "1.42vw"]}
                                            >
                                                <FlipIcon
                                                    width={"100%"}
                                                    height={"100%"}
                                                    stroke={"primary_1"}
                                                />
                                            </Button>
                                            <Text
                                                w={["22.22vw", "6vw"]}
                                                fontFamily={"raleway"}
                                                fontSize={["3.33vw", "0.89vw"]}
                                                color={"primary_1"}
                                                fontWeight={"bold"}
                                            >
                                                MEMBERSHIP BENEFITS
                                            </Text>
                                        </Flex>

                                        <Button
                                            variant={"none"}
                                            color={"primary_1"}
                                            border={"1px"}
                                            w={"fit-content"}
                                            h={"100%"}
                                            fontSize={["3.61vw", "0.9vw"]}
                                            px={["5.55vw", "1.21vw"]}
                                            borderRadius={["md"]}
                                        >
                                            COMING SOON
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </>
                    }
                    backContent={
                        <>
                            <Flex
                                flexDirection={"column"}
                                justify={"space-between"}
                                w={"100%"}
                                h={"100%"}
                                bg={"white"}
                                borderRadius={["12px", "12px", "12px", "1vw"]}
                                cursor={"default"}
                            >
                                <Flex
                                    bg={"primary_3"}
                                    color={"white"}
                                    borderTopRadius={[
                                        "12px",
                                        "12px",
                                        "12px",
                                        "1vw"
                                    ]}
                                    h={["16.67vw", "4.5vw"]}
                                    px={["9.72vw", "2.74vw"]}
                                    fontSize={["4.167vw", "1.21vw"]}
                                    alignItems={"center"}
                                    fontWeight={"bold"}
                                    fontFamily={"raleway"}
                                >
                                    MEMBERSHIP BENEFITS
                                </Flex>

                                <Flex
                                    flex={1}
                                    flexDirection={"column"}
                                    py={["6.94vw", "2.1vw"]}
                                    px={["9.72vw", "2.74vw"]}
                                >
                                    <Flex
                                        h={"100%"}
                                        flexDirection={"column"}
                                        justify={"space-between"}
                                    >
                                        <Flex
                                            flexDirection={"column"}
                                            gap={["2.5vw", "0.7vw"]}
                                        >
                                            <Text
                                                fontSize={["4.167vw", "1.21vw"]}
                                                fontFamily={"raleway"}
                                                fontWeight={600}
                                                color={"primary_3"}
                                            >
                                                Postcard Travel Concierge
                                                membership plus...
                                            </Text>

                                            <Text
                                                fontSize={["3.5vw", "1vw"]}
                                                fontFamily={"raleway"}
                                                fontWeight={500}
                                                color={"black"}
                                            >
                                                Unlock exclusive offers from
                                                local artisanal restaurants and
                                                boutique stores.
                                            </Text>
                                            <Box
                                                w={["11.11vw", "2.7vw"]}
                                                h={["1px", "1.5px"]}
                                                bg={"gray"}
                                            ></Box>

                                            <Text
                                                fontSize={["3.5vw", "1vw"]}
                                                fontFamily={"raleway"}
                                                fontWeight={500}
                                                color={"black"}
                                            >
                                                Meet and make friends with a
                                                local community of like-minded
                                                conscious luxury travellers.
                                            </Text>
                                            <Box
                                                w={["11.11vw", "2.7vw"]}
                                                h={["1px", "1.5px"]}
                                                bg={"gray"}
                                            ></Box>

                                            <Text
                                                fontSize={["3.5vw", "1vw"]}
                                                fontFamily={"raleway"}
                                                fontWeight={500}
                                                color={"black"}
                                            >
                                                Invitations to attend community
                                                pop-ups, day excursions, and
                                                weekend getaways.
                                            </Text>
                                            <Box
                                                w={["11.11vw", "2.7vw"]}
                                                h={["1px", "1.5px"]}
                                                bg={"gray"}
                                            ></Box>

                                            <Text
                                                fontSize={["3.5vw", "1vw"]}
                                                fontFamily={"raleway"}
                                                fontWeight={500}
                                                color={"black"}
                                            >
                                                Invitation to join the local
                                                private Postcard City-Circle
                                                (Whatsapp group) for community
                                                updates and announcements.
                                            </Text>
                                        </Flex>
                                        <Flex
                                            flexDirection={"column"}
                                            gap={["4.167vw", "1.93vw"]}
                                        >
                                            <Text
                                                fontFamily={"raleway"}
                                                fontSize={["4.167vw", "1.3vw"]}
                                                fontWeight={"bold"}
                                                // color={"primary_1"}
                                                color={"transparent"}
                                            >
                                                INR 50,000 per year
                                            </Text>
                                        </Flex>
                                    </Flex>

                                    <Flex
                                        mt={["5.55vw", "2.2vw"]}
                                        h={["8.33vw", "2.1vw"]}
                                        w={"100%"}
                                        alignItems={"center"}
                                        justify={"space-between"}
                                    >
                                        <Button
                                            variant="none"
                                            w={"10%"}
                                            h={"100%"}
                                            p={0}
                                            m={0}
                                            minW={["5.55vw", "1.42vw"]}
                                        >
                                            <FlipIcon
                                                width={"100%"}
                                                height={"100%"}
                                                stroke={"primary_1"}
                                            />
                                        </Button>

                                        <Button
                                            variant={"none"}
                                            color={"primary_1"}
                                            border={"1px"}
                                            w={"fit-content"}
                                            h={"100%"}
                                            fontSize={["3.61vw", "0.9vw"]}
                                            px={["5.55vw", "1.21vw"]}
                                            borderRadius={["md"]}
                                        >
                                            COMING SOON
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </>
                    }
                />
            </Flex>
        </Flex>
    );
};

export default MembershipSection;
