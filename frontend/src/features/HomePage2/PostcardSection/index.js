import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";
import { BsArrowRightCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import FlipCard from "./FlipCard";
import { Image } from "@chakra-ui/react";
import { useContext } from "react";
import FlipCard1 from "../../../patterns/FlipCard1";
import { FlipIcon } from "../../../styles/ChakraUI/icons";
import AppContext from "../../AppContext";
import { useSignupModal } from "../../SignupModalContext";
import Link from "next/link";

const PostcardSection = ({ featuredPostcards }) => {
    const { profile } = useContext(AppContext);
    const [firstLoad, setFirstLoad] = useState(true);
    const scrollContainerRef = useRef(null);
    const router = useRouter();
    const { openLoginModal } = useSignupModal();

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const scrollWidth = scrollContainerRef.current.scrollWidth;
            const clientWidth = scrollContainerRef.current.clientWidth;
            const scrollLeft = scrollContainerRef.current.scrollLeft;

            if (scrollLeft + clientWidth >= scrollWidth) {
                scrollContainerRef.current.scrollTo({
                    left: 0,
                    behavior: "smooth"
                });
            } else {
                scrollContainerRef.current.scrollBy({
                    left: 300,
                    behavior: "smooth"
                });
            }
        }
    };

    const SideCard = () => (
        <Flex
            bg={"#111111"}
            w={["88.9vw", "37.45vw"]}
            h={["auto", "34vw"]}
            mx={["5.55vw", "1.56vw"]}
            mr={["5.55vw", "0"]}
            borderRadius={["3.611vw", "1.53vw"]}
            flexDirection={"column"}
            p={"5.56vw"}
            pl={["10vw", "5.56vw"]}
            py={["25.65vw", "0vw"]}
            justifyContent="center"
            gap={["4vw", "2vw"]}
            flexShrink={0}
        >
            <Text
                fontFamily="raleway"
                fontWeight={500}
                fontSize={["9vw", "3.5vw"]}
                lineHeight={["10vw", "4.65vw"]}
                color={"#EFE9E4"}
                textAlign={"left"}
            >
                Join the
                <br />
                <Text
                    as="span"
                    fontFamily="lora"
                    fontStyle="italic"
                    fontSize={["10.38vw", "4.35vw"]}
                    lineHeight={["12vw", "4.65vw"]}
                >
                    Postcard Travel Club.
                </Text>
            </Text>
        </Flex>
    );

    return (
        <Flex
            width="100%"
            h="auto"
            flexDirection="column"
            // maxWidth="85vw"
            mb="7vw"
        >
            <Flex
                flexDirection={["column", "row"]}
                alignItems="flex-start"
                justifyContent="center"
                gap={["7.611vw", "0vw"]}
                w="100%"
            >
                <SideCard />

                {/* {cardData.map((card, index) => (
                    <ReusableFlipCard
                        key={index}
                        cardInfo={card}
                        firstLoad={index === 0 ? firstLoad : false}
                        setFirstLoad={index === 0 ? setFirstLoad : () => {}}
                    />
                ))} */}
                <Flex
                    flexDirection={["column", "row"]}
                    alignItems="flex-start"
                    justifyContent="center"
                    mx={["auto", "2vw"]}
                    gap={["7.611vw", "2vw"]}
                >
                    <Box position="relative" display="inline-block">
                        <Image
                            src="/assets/homepage/cards/travel_diary.png"
                            h={["120vw", "34vw"]}
                            minH={["55vw", "17vw"]}
                            objectFit="cover"
                            borderTopRadius={["12px", "12px", "12px", "1vw"]}
                            alt="membership card"
                        />
                        <Text
                            position="absolute"
                            bottom={["7.3vw", "2.5vw"]}
                            right={["-15%", "-11%"]}
                            transform="translateX(-50%)"
                            color="white"
                            fontSize={["5vw", "1.2vw"]}
                            fontWeight={500}
                        >
                            FREE FOREVER!
                        </Text>

                        {profile ? (
                            <Button
                                position="absolute"
                                bottom={["7vw", "2vw"]}
                                left={["27%", "30%"]}
                                transform="translateX(-50%)"
                                bg="white"
                                color="black"
                                fontSize={["3vw", "0.9vw"]}
                                fontWeight="bold"
                                borderRadius="full"
                                px={["4vw", "1.5vw"]}
                                h={["8vw", "2.5vw"]}
                                _hover={{ bg: "black", color: "white" }}
                                onClick={() => router.push(`/${profile.slug}`)}
                            >
                                MY TRAVEL DIARY
                            </Button>
                        ) : (
                            <Button
                                position="absolute"
                                bottom={["7vw", "2vw"]}
                                left={["20%", "23%"]}
                                transform="translateX(-50%)"
                                bg="white"
                                color="black"
                                fontSize={["3vw", "0.9vw"]}
                                fontWeight="bold"
                                borderRadius="full"
                                px={["4vw", "1.5vw"]}
                                h={["8vw", "2.5vw"]}
                                _hover={{ bg: "black", color: "white" }}
                                onClick={() => openLoginModal()}
                            >
                                SIGN UP!
                            </Button>
                        )}
                    </Box>

                    <Box position="relative" display="inline-block">
                        <Image
                            src={"/assets/homepage/cards/travel_concierge.png"}
                            h={["120vw", "34vw"]}
                            minH={["55vw", "17vw"]}
                            objectFit="cover"
                            borderTopRadius={["12px", "12px", "12px", "1vw"]}
                            alt="membership card"
                        />

                        <Button
                            as="a"
                            href="https://form.typeform.com/to/hEPBut5I"
                            target="_blank"
                            rel="noopener noreferrer"
                            position="absolute"
                            bottom={["7vw", "2vw"]}
                            left={["23%", "25%"]}
                            transform="translateX(-50%)"
                            bg="white"
                            color="black"
                            fontSize={["3vw", "0.9vw"]}
                            fontWeight="bold"
                            borderRadius="full"
                            px={["4vw", "1.5vw"]}
                            h={["8vw", "2.5vw"]}
                            _hover={{ bg: "black", color: "white" }}
                        >
                            APPLY NOW!
                        </Button>

                        <Text
                            position="absolute"
                            bottom={["7.5vw", "2.5vw"]}
                            right={["-17%", "-12%"]}
                            transform="translateX(-50%)"
                            color="white"
                            fontSize={["5vw", "1.2vw"]}
                            fontWeight={500}
                        >
                            INR 25,000 / YEAR
                        </Text>
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default PostcardSection;
