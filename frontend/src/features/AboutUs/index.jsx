import { Box, Flex, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react'
import React from 'react'
import { DownArrowIcon } from '../../styles/ChakraUI/icons'
import { ChakraNextImage } from '../../patterns/ChakraNextImage'

const Aboutus = () => {
    const sections = [
        "Origin story",
        "Conscious Luxury Travel Pivot",
        "Postcard Travel Club",
        "Community Growth in 2024",
        "What's next - 2025",
        "Credits",
        // "Special Thanks",
    ]

    const getBoldSpanHtml = (text) => <span style={{ fontWeight: 600 }}>{text}</span>
    return (
        <Flex flexDirection={"column"}>
            <Flex px={["12.22vw", "6vw"]} pt={"4.2vw"} pb={["15vw", "8vw"]} flexDirection={"column"}>
                <Text
                    fontSize={["7.78vw", "4.58vw"]}
                    lineHeight={["8.88vw", "4.72vw"]}
                    color={"#111111"}
                    fontFamily={"lora"}
                    fontStyle={"italic"}
                    fontWeight={500}
                >
                    About Postcard Travel Club
                </Text>
                <Text
                    color={"#111111"}
                    // pl={["12.22vw", "6vw"]}
                    // mb={"5vw"}
                    mt={"4vw"}
                    fontFamily={"raleway"}
                    // fontStyle={"italic"}
                    fontSize={["6.4vw", "3.06vw"]}
                    lineHeight={["7.5vw", "3.5vw"]}
                >
                    The members club for conscious luxury travel and lifestyle.
                </Text>

                {/* <Text
                    my={"5vw"}
                    color={"#111111"}
                    fontFamily={"raleway"}
                    fontSize={"3.06vw"}
                    lineHeight={"3.5vw"}
                >
                    The social network for conscious luxury travel.
                </Text> */}

                {/* <Text
                    mt={"1.5vw"}
                    fontSize={"1.46vw"}
                    lineHeight={"1.875vw"}
                    fontWeight={"400"}
                    fontFamily={"raleway"}
                >
                    Postcard Travel Club was founded to unite a global community of conscious luxury travellers, boutique properties, travel designers and destination experts with a shared vision for responsible tourism.<br />
                    <Box as="span" h="1vw" />
                    As a social network and an invaluable resource for mindful travellers, Postcard Travel Club fosters authentic connections and meaningful experiences worldwide.<br />
                    <Box as="span" h="1vw" />
                    Our community-first platform offers members the chance to collect unique postcards, share travel inspiration and connect directly with trusted invitation-only partners. Our gamified experience allows members to build a personal network of recommendations, access curated travel experiences and discover bespoke journeys.<br />
                    <Box as="span" h="1vw" />
                    Postcard Travel Club's collective impact grows every day, attracting new storytellers and inspiring media and influencer attention, all helping to shape a more conscious and sustainable future for luxury travel.<br />
                    <Box as="span" h="1vw" />
                    Join us, and be part of a movement that is redefining the way we explore the world and helping make travel a force for good!
                </Text> */}
            </Flex>

            <Flex mt={"-2.1vw"} pt={"4.2vw"} pb={["24vw", "6.3vw"]} zIndex={1} borderTopRadius={["4.167vw", "2.08vw"]} flexDirection={"column"} bg={"primary_1"} w={"100%"}
            >
                <Flex gap={["4vw", "2vw"]} px={["12.22vw", "6vw"]} my={["8vw", "3vw"]} flexDirection={["column", "row"]}>

                    <Flex flexDirection={"column"} flex={1}>

                        <Text
                            // mt={"1.5vw"}
                            fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["4.5vw", "1.875vw"]}
                            color={"#EFE9E4"}
                            fontWeight={"400"}
                            fontFamily={"raleway"}
                        >
                            Postcard Travel Club was founded to unite a global community of conscious luxury travellers, boutique properties, travel designers and destination experts with a shared vision for responsible tourism.<br />
                            <Box as="span" display={"block"} h={["4.5vw", "1.875vw"]} />
                            As a social network and an invaluable resource for mindful travellers, Postcard Travel Club fosters authentic connections and meaningful experiences worldwide.<br />
                            <Box as="span" display={"block"} h={["4.5vw", "1.875vw"]} />
                            Our community-first platform offers members the chance to collect unique postcards, share travel inspiration and connect directly with trusted invitation-only partners. Our gamified experience allows members to build a personal network of recommendations, access curated travel experiences and discover bespoke journeys.<br />
                            <Box as="span" display={"block"} h={["4.5vw", "1.875vw"]} />
                            Postcard Travel Club's collective impact grows every day, attracting new storytellers and inspiring media and influencer attention, all helping to shape a more conscious and sustainable future for luxury travel.<br />
                            <Box as="span" display={"block"} h={["4.5vw", "1.875vw"]} />
                            Join us, and be part of a movement that is redefining the way we explore the world and helping make travel a force for good!
                        </Text>
                    </Flex>
                    <Flex flexDirection={"column"} w={["100%", "40%"]} gap={"1vw"} mt={["6vw", 0]}>
                        {sections?.map((section, index) => (
                            <Flex
                                as={Link}
                                key={index}
                                href={`#${section}`}
                                w={"100%"}
                                h={["11.11vw", "4.17vw"]}
                                bg={"#EDB6A9"}
                                color={"primary_1"}
                                borderRadius={["2.78vw", "1.04vw"]}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                px={["6.4vw", "1.94vw"]}
                                fontFamily={"raleway"}
                                fontSize={["3.89vw", "1.46vw"]}
                                lineHeight={["5vw", "1.87vw"]}
                                _hover={{ bg: "#EFE9E4" }}
                            >
                                <Text>{section}</Text>
                                <DownArrowIcon
                                    h={"100%"}
                                    w={["4vw", "1.25vw"]}
                                />
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
            </Flex>

            <Flex id={sections[0]} mt={"-2.1vw"} px={["12.22vw", "14vw"]} pt={"8vw"} pb={["24vw", "6.3vw"]} zIndex={2} bg={"white"} gap={"1vw"} borderTopRadius={["4.167vw", "2.08vw"]} w={"100%"} flexDirection={"column"}
                boxShadow={["0px -20px 25px 0px rgba(0,0,0,0.2)", "0px -35px 25px 0px rgba(0,0,0,0.2)"]}
            >
                <Text
                    color={"primary_1"}
                    fontFamily={"lora"}
                    fontStyle={"italic"}
                    fontSize={["6.4vw", "3.06vw"]}
                >
                    Origin Story
                </Text>
                <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} my={"4vw"} color={"#111111"} fontFamily={"raleway"}>Storytelling platform for mindful travel</Text>
                <ChakraNextImage
                    borderRadius={["3.611vw", "1.67vw"]}
                    src={"https://images.postcard.travel/postcardv2/IMG_9782_1_removebg_preview_37ce22e7ce.png"}
                    w={["78.611vw", "70.05vw"]}
                    h={["50.28vw", "34.72vw"]}
                    objectFit={"contain"}
                    alt="Postcard Origin Story Image"
                />

                <Text
                    my={"4vw"}
                    mb={"5vw"}
                    fontSize={["3.5vw", "1.46vw"]}
                    lineHeight={["5vw", "1.875vw"]}
                    fontWeight={"400"}
                    fontFamily={"raleway"}
                >
                    Founded on September 1, 2020, <a style={{ cursor: "pointer", fontWeight: "600" }} href={"/amitjaipuria"} target="_blank">Amit Jaipuria</a> launched Postcard Travel as a passion project to build a storytelling platform to promote mindful travel and responsible tourism.
                    <br /><Box as="span" display={"block"} h={["4.5vw", "1.875vw"]} />
                    Between 2020 and 2022, Amit and his technology team led by {getBoldSpanHtml("Sanjay Soni")} and {getBoldSpanHtml("Angel M")} made several pivots to the platform in search of product market fit and a sustainable and scalable business model.
                </Text>
            </Flex>

            <Flex id={sections[1]} mt={"-2.1vw"} px={["12.22vw", "14vw"]} pt={"8vw"} pb={["24vw", "6.3vw"]} zIndex={3} bg={"white"} gap={"1vw"} borderTopRadius={["4.167vw", "2.08vw"]} w={"100%"} flexDirection={"column"}
                boxShadow={["0px -20px 25px 0px rgba(0,0,0,0.2)", "0px -35px 25px 0px rgba(0,0,0,0.2)"]}
            >
                <Text
                    color={"primary_1"}
                    fontFamily={"lora"}
                    fontStyle={"italic"}
                    fontSize={["6.4vw", "3.06vw"]}
                >
                    Conscious Luxury Travel Pivot
                </Text>
                <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} my={"4vw"} color={"#111111"} fontFamily={"raleway"}>Introduction to the Transformational Travel Council, The Long Run and the cause for Conscious Luxury Travel</Text>
                <ChakraNextImage
                    borderRadius={["3.611vw", "1.67vw"]}
                    src={"https://images.postcard.travel/postcardv2/762bddc0_62e7_416d_bc33_9d17d331d979_f8142c990c.webp"}
                    w={["78.611vw", "70.05vw"]}
                    h={["50.28vw", "34.72vw"]}
                    objectFit={"cover"}
                    boxShadow={"6px 6px 6px rgba(0, 0, 0, 0.16)"}
                    mt={["4vw", 0]}
                    mb={["6vw", 0]}
                    alt={"Conscious Luxury Travel Pivot"}
                />

                <Text
                    my={"4vw"}
                    fontSize={["3.5vw", "1.46vw"]}
                    lineHeight={["5vw", "1.875vw"]}
                    fontWeight={"400"}
                    fontFamily={"raleway"}
                >
                    Then, Amit was introduced to the Transformational Travel Council (TTC) and The Long Run (TLR) as organisations that were helping people and brands advancing responsible tourism. Between 2022 and 2023, he visited Slovenia for the TTC Transcend event and Nikoi Island for the TLR Annual Summit where he learnt of the challenges being faced by boutique luxury brands in connecting with value-aligned luxury customers using traditional marketing channels.
                    <br /><Box as="span" display={"block"} h={["4.5vw", "1.875vw"]} />
                    As a luxury traveller lacking awareness of the inspiring boutique properties and tours being promoted by TTC and TLR, he identified this problem as a key opportunity in the marketplace and one where traditional solutions weren't filling the need gap. Amit believed that this industry category for “{getBoldSpanHtml("conscious luxury travel")}” was under-marketed to the luxury traveller community and the potential for developing a platform that could bridge this discovery gap would serve as a significant tool to advance the cause for responsible tourism.
                    <br /><Box as="span" display={"block"} h={["4.5vw", "1.875vw"]} />
                    He then gathered together a storytelling team led by {getBoldSpanHtml("Karen Hastings")} and <a href={"/Deeksha-Sharma-886"} target="_blank" style={{ fontWeight: 600 }}>Deeksha Sharma</a>, a partnerships team led by {getBoldSpanHtml("Elizabeth Scutchfield")} and <a href={"/jainaashah"} target="_blank" style={{ fontWeight: 600 }}>Jaina Shah</a>, and a new media team led by {getBoldSpanHtml("Rhea Bhambani")} to work on new concepts and narratives to find a scalable product and business model and spread the word for conscious luxury travel.
                </Text>
            </Flex>

            <Flex id={sections[2]} mt={"-2.1vw"} px={["12.22vw", "14vw"]} pt={"8vw"} pb={["24vw", "6.3vw"]} zIndex={3} bg={"white"} gap={"1vw"} borderTopRadius={["4.167vw", "2.08vw"]} w={"100%"} flexDirection={"column"}
                boxShadow={["0px -20px 25px 0px rgba(0,0,0,0.2)", "0px -35px 25px 0px rgba(0,0,0,0.2)"]}
            >
                <Text
                    color={"primary_1"}
                    fontFamily={"lora"}
                    fontStyle={"italic"}
                    fontSize={["6.4vw", "3.06vw"]}
                >
                    Postcard Travel Club
                </Text>
                <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} my={"4vw"} color={"#111111"} fontFamily={"raleway"}>Connecting the world of conscious luxury travel.</Text>
                <ChakraNextImage
                    borderRadius={["3.611vw", "1.67vw"]}
                    src={"https://images.postcard.travel/postcardv2/PTC_Retro_Travel_Stamp_Blue_Filled_Transparent_aec60cc785.webp"}
                    w={["78.611vw", "70.05vw"]}
                    h={["50.28vw", "34.72vw"]}
                    objectFit={"contain"}
                    alt="Postcard logo"
                // boxShadow={"6px 6px 6px rgba(0, 0, 0, 0.16)"}
                />

                <Text
                    my={"4vw"}
                    fontSize={["3.5vw", "1.46vw"]}
                    lineHeight={["5vw", "1.875vw"]}
                    fontWeight={"400"}
                    fontFamily={"raleway"}
                >
                    Together, the team decided that there was a need to bring together a global community of value-aligned travellers, boutique properties, travel designers, destination experts, travel coaches and others who collectively promoted conscious luxury travel and responsible tourism.
                    <br /><Box as="span" display={"block"} h={["4.5vw", "1.875vw"]} />
                    With a community-first mindset and an ecosystems-approach to product vision and development, Postcard Travel rebranded as Postcard Travel Club with the intention to build a social network and a comprehensive global resource for the conscious luxury travel niche within the industry.
                    <br /><Box as="span" display={"block"} h={["4.5vw", "1.875vw"]} />
                    The team believes that as the community of conscious luxury travellers grows, they would attract more partners to come onboard; which would lead to more storytellers and stories being published. This collective impact is likely to attract attention from media and influencers, ultimately driving growth in conscious luxury travel and responsible tourism.
                </Text>
            </Flex>

            <Flex id={sections[3]} mt={"-2.1vw"} px={["12.22vw", "14vw"]} pt={"8vw"} pb={["24vw", "6.3vw"]} zIndex={3} bg={"white"} gap={"1vw"} borderTopRadius={["4.167vw", "2.08vw"]} w={"100%"} flexDirection={"column"}
                boxShadow={["0px -20px 25px 0px rgba(0,0,0,0.2)", "0px -35px 25px 0px rgba(0,0,0,0.2)"]}
            >
                <Text
                    color={"primary_1"}
                    fontFamily={"lora"}
                    fontStyle={"italic"}
                    fontSize={["6.4vw", "3.06vw"]}
                >
                    Community Growth in 2024
                </Text>
                <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} mt={"4vw"} mb={"2vw"} color={"#111111"} fontFamily={"raleway"}>In 2024, Postcard onboarded over 300 partners from 35 countries including boutique properties, travel designers, and destination experts.</Text>
                <UnorderedList fontSize={["3.5vw", "1.46vw"]}
                    lineHeight={["5vw", "1.875vw"]}
                    fontWeight={"400"}
                    fontFamily={"raleway"}>
                    <ListItem my={"1vh"}>By invitation only</ListItem>
                    <ListItem my={"1vh"}>Complimentary Postcard Partner page with two Postcard Experiences</ListItem>
                    <ListItem my={"1vh"}>Optional upgrade - Enhanced profile with additional postcards</ListItem>
                    <ListItem my={"1vh"}>Annual Partnership Fee starting year 2</ListItem>
                </UnorderedList>

                <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} mt={"4vw"} mb={"2vw"} color={"#111111"} fontFamily={"raleway"}>In 2024, over 3,500 conscious luxury travellers from 25 countries joined the club, most of whom were between the ages of 30-55</Text>
                <UnorderedList fontSize={["3.5vw", "1.46vw"]}
                    lineHeight={["5vw", "1.875vw"]} mb={"4vw"}
                    fontWeight={"400"}
                    fontFamily={"raleway"}>
                    <ListItem my={"1vh"}>Free membership</ListItem>
                    <ListItem my={"1vh"}>Fun, gamified experience - collecting postcards, sharing collections, following friends, family and destination experts.</ListItem>
                    <ListItem my={"1vh"}>Recommendations from a personal trusted network</ListItem>
                    <ListItem my={"1vh"}>Direct links to partners</ListItem>
                    <ListItem my={"1vh"}>Optional upgrade - Postcard Concierge - launching soon (travel advisory, last-minute deals, special rates and more)</ListItem>
                </UnorderedList>
            </Flex>

            <Flex id={sections[4]} mt={"-2.1vw"} px={["12.22vw", "14vw"]} pt={"8vw"} pb={["24vw", "6.3vw"]} zIndex={3} bg={"white"} gap={"1vw"} borderTopRadius={["4.167vw", "2.08vw"]} w={"100%"} flexDirection={"column"}
                boxShadow={["0px -20px 25px 0px rgba(0,0,0,0.2)", "0px -35px 25px 0px rgba(0,0,0,0.2)"]}
            >
                <Text
                    color={"primary_1"}
                    fontFamily={"lora"}
                    fontStyle={"italic"}
                    fontSize={["6.4vw", "3.06vw"]}
                >
                    What's next - 2025
                </Text>

                <Text
                    mt={"4vw"} fontSize={["3.5vw", "1.46vw"]}
                    lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                    We have started sowing the seeds for our International partner growth with the {getBoldSpanHtml("Postcard Regional Ambassador Program")} where we partner with value-aligned people and businesses to bring onboard local partners that advance conscious luxury travel.
                </Text>

                <Text fontSize={["3.5vw", "1.46vw"]}
                    lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                    As we scale the {getBoldSpanHtml("Postcard Partner Community")} we also have multiple plans to activate and grow the {getBoldSpanHtml("Postcard Traveller Network")}. Some of the initiatives in development include
                </Text>

                <UnorderedList fontSize={["3.5vw", "1.46vw"]}
                    lineHeight={["5vw", "1.875vw"]}
                    fontWeight={"400"}
                    fontFamily={"raleway"}>
                    <ListItem my={"1vh"}>Postcard Collections for members</ListItem>
                    <ListItem my={"1vh"}>Postcard Rewards Program for influencers</ListItem>
                    <ListItem my={"1vh"}>Postcard Community activations</ListItem>
                    <ListItem my={"1vh"}>Postcard Co-marketing partnerships</ListItem>
                    <ListItem my={"1vh"}>Postcard Concierge Service</ListItem>
                    <ListItem my={"1vh"}>Postcard Travel Advisors</ListItem>
                    <ListItem my={"1vh"}>Postcard AI ChatBot</ListItem>
                </UnorderedList>

                <Text fontSize={["3.5vw", "1.46vw"]}
                    lineHeight={["5vw", "1.875vw"]} mb={"4vw"}
                    color={"#111111"} fontFamily={"raleway"}>
                    Stay tuned for more.
                </Text>
            </Flex>

            <Flex id={sections[5]} mt={"-2.1vw"} px={["12.22vw", "14vw"]} pt={"8vw"} pb={["24vw", "6.3vw"]} zIndex={3} bg={"white"} gap={"1vw"} borderTopRadius={["4.167vw", "2.08vw"]} w={"100%"} flexDirection={"column"}
                boxShadow={["0px -20px 25px 0px rgba(0,0,0,0.2)", "0px -35px 25px 0px rgba(0,0,0,0.2)"]}
            >
                <Text
                    color={"primary_1"}
                    fontFamily={"lora"}
                    fontStyle={"italic"}
                    fontSize={["6.4vw", "3.06vw"]}
                >
                    Credits
                </Text>

                <Flex mt={"3vw"} pb={"4vw"} flexWrap={"wrap"} justifyContent={"space-between"} gap={"2vw"} flexDirection={["column", "row"]}>
                    <Flex flexDirection={"column"} w={["100%", "40%"]} mb={["4vw", 0]}>
                        <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} mb={"2vw"} color={"#111111"} fontFamily={"raleway"}>
                            Product & Tech Circle
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Amit Jaipuria
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Sanjay Soni
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Angel M
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Suresh M
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Aniket Pawar
                        </Text>
                    </Flex>

                    <Flex flexDirection={"column"} w={["100%", "40%"]} mb={["4vw", 0]}>
                        <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} mb={"2vw"} color={"#111111"} fontFamily={"raleway"}>
                            Storytellers Circle
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Karen Hastings
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Deeksha Sharma
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Vineeta Shetty
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Pooja Akula
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            (Bench of storytellers)
                        </Text>
                    </Flex>

                    <Flex flexDirection={"column"} w={["100%", "40%"]} mb={["4vw", 0]}>
                        <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} mb={"2vw"} color={"#111111"} fontFamily={"raleway"}>
                            Partnerships Circle
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Elizabeth Scutchfield
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Mona Lewicka
                        </Text>
                    </Flex>

                    <Flex flexDirection={"column"} w={["100%", "40%"]} mb={["4vw", 0]}>
                        <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} mb={"2vw"} color={"#111111"} fontFamily={"raleway"}>
                            New Media Circle
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Jaina Shah
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Rhea Bhambani
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Elizabeth Drolet
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Deeksha Agrawal
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Richie Gordon
                        </Text>
                    </Flex>

                    <Flex flexDirection={"column"} w={["100%", "40%"]} mb={["4vw", 0]}>
                        <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} mb={"2vw"} color={"#111111"} fontFamily={"raleway"}>
                            UI/UX & Design Circle
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Renuka Gabhale
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Robby Banner
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Mukul Ranjan Dev
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Pratiksha Soni
                        </Text>
                    </Flex>

                    <Flex flexDirection={"column"} w={["100%", "40%"]} mb={["4vw", 0]}>
                        <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} mb={"2vw"} color={"#111111"} fontFamily={"raleway"}>
                            PR Circle
                        </Text>
                        <Text fontSize={["3.5vw", "1.46vw"]}
                            lineHeight={["5vw", "1.875vw"]} color={"#111111"} fontFamily={"raleway"}>
                            Wish Box Studios
                        </Text>
                    </Flex>
                </Flex>



            </Flex>

            {/* <Flex id={sections[6]} mt={"-2.1vw"} px={["12.22vw", "14vw"]} pt={"8vw"} pb={["24vw", "6.3vw"]} zIndex={3} bg={"#EFE9E4"} gap={"1vw"} borderTopRadius={["4.167vw", "2.08vw"]} w={"100%"} flexDirection={"column"}
                boxShadow={["0px -20px 25px 0px rgba(0,0,0,0.2)", "0px -35px 25px 0px rgba(0,0,0,0.2)"]}
            >
                <Text
                    color={"primary_1"}
                    fontFamily={"lora"}
                    fontStyle={"italic"}
                    fontSize={["6.4vw", "3.06vw"]}
                >
                    Special Thanks
                </Text>

                <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} my={"2vw"} color={"#111111"} fontFamily={"raleway"}>
                    Shoba George - The Pashmina Trail in Ladakh
                    <br /><Box as="span" h={"1vh"} />
                    (1st Postcard Tour and Podcast guest)
                </Text>

                <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} my={"2vw"} color={"#111111"} fontFamily={"raleway"}>
                    Sapna Bhatia, Kaner Retreat
                    <br /><Box as="span" h={"1vh"} />
                    (1st Postcard Stay)
                </Text>

                <Text fontSize={["4.44vw", "2.08vw"]} lineHeight={["5.55vw", "2.64vw"]} my={"2vw"} color={"#111111"} fontFamily={"raleway"}>
                    Shilpa Sharma - Breakaway Tours
                    <br /><Box as="span" h={"1vh"} />
                    (1st Destination Expert)
                </Text>
            </Flex> */}

        </Flex >
    )
}

export default Aboutus