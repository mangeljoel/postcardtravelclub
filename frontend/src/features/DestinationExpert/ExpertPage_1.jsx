import { Box, Flex, Grid, GridItem, Icon, Text } from '@chakra-ui/react'
import React from 'react'
import { ChakraNextImage } from '../../patterns/ChakraNextImage'
import { RiDoubleQuotesL, RiDoubleQuotesR } from 'react-icons/ri'
import { customMarkdown } from './index.module.scss';
import RenderMarkdown from '../../patterns/RenderMarkdown';
import TestimonialCard from './About/TestimonialCard';
import { data } from "./data"

const ExpertPage = () => {
    const testimonials = [
        {
            title: "Shilpa is masterful in how she organised the journey and experiences",
            content: "This trip is the gift that keeps on giving. We love the experience and it is already amazing.Shilpa is masterful in how she organised the journey and experiences.I am appreciating it more and more.",
            author: "Julia & Andrew", time: "Delhi, Agra & Jaipur, Mar-Apr 2024"
        },
        {
            title: "I felt very safe going with Shilpa and Bindu at breakaway",
            content: "My experience with breakaway has been fantastic. I've done two trips with them so far. Both to ladakh, one with family and the other as a solo female traveller. Breakaway was able to provide a unique experience both the times. Even though I did most of the routine tourist circuit, they were able to curate the itinerary such that I got a taste of ladakhi culture beyond what a general tourist would. As a solo traveller on an 18 day trip , I felt very safe going with Shilpa and Bindu at breakaway. Bindu was constantly in touch, and also suggested some fantastic places to visit and local folks to meet while I was there. They even managed to convince a pottery studio that was closing for the season to remain open for an additional day so I take a workshop with them! Their strong, reliable network (interpreters, hotel owners, drivers, trekking guides, etc) in Ladakh was a key factor for why I felt so safe. They really did go the extra mile to create a unique, fulfilling experience and I look forward to visiting more places with them!",
            author: "Kanchi Dave + Solo traveller", time: "Ladakh, Aug 2023"
        },
        {
            title: "It was an incredible experience for me to be able to meet and share my experiences with many designers and creators, and to see artists and artisans at work.",
            content: "I recently participated in a several-day textile tour organized by Breakaway in and around Calcutta. Since I myself weave, it was an incredible experience for me to be able to meet and share my experiences with many designers and creators, and to see artists and artisans at work.The scale of the places visited ranged from quite simple, hidden rural workshops to workshops with museum - quality pieces or a salon of internationally famous designer. The accommodations were very varied, from a boutique hotel to a palace ; or the master's house of a former indigo plantation. I would like to thank Bindu M S once again for the organization.I could contact her with any request even before the trip.It was a wonderful, life- changing experience.",
            author: "Kati Murbach-Schmidt", time: "W. Bengal Textile trail, Oct 2023"
        },
    ]
    return (
        <>
            <Box
                w={"100%"}
                minH={["181.11vw", "50.4vw"]}
                px={["5.56vw", "2.22vw"]}
                my={["6.94vw", "2.22vw"]}
            // bg="#EFE9E4"
            >
                <Box
                    w={"100%"}
                    h={"100%"}
                    bg={"#111111"}
                    borderRadius={["4.167vw", "2.08vw"]}
                    position="relative"
                >
                    <ChakraNextImage
                        borderTopRadius={["4.167vw", "2.08vw"]}
                        noLazy={true}
                        priority
                        // src={"/assets/defaultcover.jpg"}
                        src={"https://images.postcard.travel/postcardv2/IMG_7498_e73766238e.png"}
                        w={"100%"}
                        h={["152.33vw", "42.74vw"]}
                        objectFit="cover"
                        alt={"Shilpa Sharma coverImage"}
                    />

                    <Box
                        w={"100%"}
                        h={["152.33vw", "42.74vw"]}
                        position={"absolute"}
                        top={0}
                        left={0}
                        pl={["8.33vw", "6.46vw"]}
                        pr={["6.67vw", "6.11vw"]}
                        // bg={"rgba(0,0,0,0.4)"}
                        bgGradient="linear(to-t, #111111 2%, transparent 50%)"
                        borderTopRadius={["4.167vw", "2.08vw"]}
                    >
                        <Flex
                            w={"100%"}
                            h={"100%"}
                            flexDirection={"column"}
                            justify={"flex-end"}
                            borderRadius={["4.167vw", "2.08vw"]}
                        >
                            <Flex
                                display={{ base: "none", sm: "flex" }}
                                // h={"14.1vw"}
                                // mt={"17.8vw"}
                                flexDirection={"column"}
                                gap={"1vw"}
                            >
                                <Text
                                    maxW={"55.76vw"}
                                    fontSize={"5vw"}
                                    lineHeight={"4.72vw"}
                                    color={"white"}
                                    fontFamily={"lora"}
                                    fontStyle={"italic"}
                                >
                                    Shilpa Sharma
                                </Text>
                                <Text
                                    maxW={"55.76vw"}
                                    fontSize={"4.58vw"}
                                    lineHeight={"4.72vw"}
                                    color={"white"}
                                    fontFamily={"raleway"}
                                >
                                    Breakaway, India
                                </Text>
                                {/* <Box h={"3.47vw"}></Box> */}
                            </Flex>

                            <Flex
                                display={{ base: "flex", sm: "none" }}
                                flexDirection={"column"}
                                mt={"auto"}
                                gap={"6.67vw"}
                            >
                                <Flex flexDirection={"column"} gap={"1vw"}>
                                    <Text
                                        w={"100%"}
                                        fontSize={"8.2vw"}
                                        lineHeight={"8.88vw"}
                                        color={"white"}
                                        fontFamily={"lora"}
                                        fontStyle={"italic"}
                                    >
                                        Shilpa Sharma
                                    </Text>
                                    <Text
                                        w={"100%"}
                                        fontSize={"7.78vw"}
                                        lineHeight={"8.88vw"}
                                        color={"white"}
                                        fontFamily={"raleway"}
                                    >
                                        Breakaway, India
                                    </Text>
                                </Flex>
                                <Text
                                    color={"#EFE9E4"}
                                    fontFamily={"raleway"}
                                    fontWeight={400}
                                    fontSize={"3.89vw"}
                                    lineHeight={"5vw"}
                                >
                                    Textile, Craft, Design, Cuisine and Community-Focused Immersions in India
                                </Text>
                                <Box h={"2.33vw"}></Box>
                            </Flex>

                            <Text
                                display={{ base: "none", sm: "flex" }}
                                color={"#EFE9E4"}
                                fontFamily={"raleway"}
                                fontWeight={400}
                                fontSize={"1.87vw"}
                                mt={"3.26vw"}
                            >
                                Textile, Craft, Design, Cuisine and Community-Focused Immersions in India
                            </Text>

                            <Box
                                h={"2px"}
                                mt={["2vw", "1.5vw"]}
                                w={"100%"}
                                bg={"#EFE9E4"}
                            ></Box>
                        </Flex>
                    </Box>

                    <Flex
                        flexDirection={"column"}
                        w={"100%"}
                        color={"#EFE9E4"}
                        alignItems={"center"}
                        pl={["8.33vw", "6.46vw"]}
                        pr={["6.67vw", "6.11vw"]}
                        py={["6.67vw", "4vw"]}
                    >
                        <Text
                            w={"100%"}
                            mb={["4vw", "2vw"]}
                            textAlign={"left"}
                            color={"#EFE9E4"}
                            fontFamily={"raleway"}
                            fontWeight={400}
                            fontSize={["3.89vw", "1.87vw"]}
                        >
                            <Text as="span"><Icon as={RiDoubleQuotesL} /></Text> The most radical thing we can do is introduce people to one another. New connections & conversations spark innovation. <Text as="span"><Icon as={RiDoubleQuotesR} /></Text>
                        </Text>
                        <Text color={"#EFE9E4"}
                            fontFamily={"lora"}
                            fontStyle={"italic"}
                            fontWeight={400}
                            fontSize={["3.89vw", "1.87vw"]}
                            w={"100%"}
                            textAlign={"right"}
                        >
                            - Rosabeth Moss Kanter
                        </Text>
                    </Flex>

                </Box>
            </Box>

            <Box w={"100%"} mt={["2vw", "3vw"]}>

                {data?.map((content, index) => {
                    return (
                        index == 0 ? (
                            <Box
                                key={index}
                                id={"Founder's Message"}
                                w={"100%"}
                                bg={"primary_1"}
                                px={[
                                    "12.22vw",
                                    "8.5vw"
                                ]}
                                py={[
                                    "10.83vw",
                                    "6.875vw"
                                ]}
                                borderTopRadius={[
                                    "4.167vw",
                                    "2.08vw"
                                ]}
                            >
                                <Flex
                                    flexDirection={
                                        "column"
                                    }
                                >
                                    <Text
                                        color={
                                            "#EFE9E4"
                                        }
                                        fontFamily={
                                            "lora"
                                        }
                                        fontStyle={
                                            "italic"
                                        }
                                        fontSize={[
                                            "7.78vw",
                                            "3.06vw"
                                        ]}
                                    >
                                        {content?.question}
                                    </Text>

                                    <Box
                                        h={[
                                            "1px",
                                            "2px"
                                        ]}
                                        my={[
                                            "6.94vw",
                                            "3.125vw"
                                        ]}
                                        w={"100%"}
                                        bg={"#EFE9E4"}
                                    ></Box>

                                    <Flex
                                        mt={[
                                            "0vw",
                                            "2.57vw"
                                        ]}
                                        justifyContent={
                                            "space-between"
                                        }
                                        flexDirection={[
                                            "column-reverse",
                                            "row"
                                        ]}
                                        gap={"5vw"}
                                    >
                                        <Flex
                                            flex={1}
                                            flexDirection={
                                                "column"
                                            }
                                            w={[
                                                "100%",
                                                "52.85vw"
                                            ]}
                                            className={
                                                customMarkdown
                                            }
                                        >
                                            {/* <Text color={"#EFE9E4!important"} >{content.data}</Text> */}
                                            <RenderMarkdown
                                                content={
                                                    content.data
                                                }
                                                color={"#EFE9E4"}
                                            />
                                        </Flex>

                                        <Flex bg={"#EFE9E4"} w={["80vw", "25vw"]} h={["80vw", "25vw"]} borderRadius={"100%"} p={["2vw", "0.7vw"]}>
                                            <ChakraNextImage w={"100%"} h={"100%"} borderRadius={"100%"} objectFit={"cover"} src={content.images[0]} />
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Box>
                        )
                            :
                            (<Box
                                key={`section_${index}`}
                                w={"100%"}
                                bg={"transparent!important"}
                                mt={"auto"}
                            >
                                <Box
                                    key={index}
                                >
                                    <Box
                                        w={"100%"}
                                        bg={"white"}
                                        borderTopRadius={[
                                            "4.167vw",
                                            "2.08vw"
                                        ]}
                                        mt={[
                                            "-4.167vw",
                                            "-2.08vw"
                                        ]}
                                        px={[
                                            "0",
                                            "18.54vw"
                                        ]}
                                        // py={[
                                        //     "13.33vw",
                                        //     "6.32vw"
                                        // ]}
                                        py={[
                                            "15vw",
                                            "8vw"
                                        ]}
                                        boxShadow={index > 0 && [
                                            "0px -20px 25px 0px rgba(0,0,0,0.2)",
                                            "0px -35px 25px 0px rgba(0,0,0,0.2)"
                                        ]}
                                    >
                                        <Text
                                            color={
                                                "primary_1"
                                            }
                                            fontFamily={
                                                "lora"
                                            }
                                            px={["10.55vw", "0"]}
                                            fontStyle={
                                                "italic"
                                            }
                                            fontSize={[
                                                "6.5vw",
                                                "3.06vw"
                                            ]}
                                            lineHeight={[
                                                "8.5vw",
                                                "4vw"
                                            ]}
                                        >
                                            {content?.question}
                                        </Text>

                                        {content?.images?.length > 0 && (
                                            <Grid

                                                //mx={[0, "8.65vw"]}
                                                px={["11.55vw", "0"]}
                                                my={[8, 8, 16]}
                                                w="100%"
                                                className="no-scrollbar"
                                                // mr={["-5vw", "auto"]}
                                                // ml={["5vw", "auto"]}
                                                // h={["30vh", "80vh"]}
                                                overflowX={["auto", "auto", "hidden"]}
                                                templateColumns={["", "repeat(3, 1fr)"]}
                                                gridAutoFlow={"column"}
                                                templateRows={["", "repeat(1, 1fr)"]}
                                                gap={6}
                                            >
                                                {content?.images.map((image, index) => (
                                                    <Box
                                                        key={index}
                                                        height="auto"
                                                        maxH={["184px", "368px"]}
                                                        width={["75vw", "auto"]}
                                                        maxW={["256px", "512px"]}
                                                        aspectRatio="4 / 3"
                                                        borderRadius="20px"
                                                        overflow="hidden"
                                                    >
                                                        <ChakraNextImage
                                                            w="100%"
                                                            h="100%"
                                                            src={image}
                                                            objectFit="cover"
                                                        />
                                                    </Box>
                                                ))}
                                            </Grid>
                                            // </Box>
                                        )}





                                        <Flex
                                            flexDirection={"column"}
                                            px={["10.55vw", "0"]}
                                        >
                                            <Box
                                                className={customMarkdown}
                                            >

                                                <RenderMarkdown
                                                    content={
                                                        content.data
                                                    }
                                                />
                                            </Box>
                                        </Flex>
                                    </Box>
                                </Box>
                            </Box>)
                    )
                })}

                <Box
                    key={`Testimonials Section`}
                    w={"100%"}
                    bg={"transparent!important"}
                    mt={"auto"}
                >
                    <Box>
                        <Box
                            w={"100%"}
                            bg={"white"}
                            borderTopRadius={["4.167vw", "2.08vw"]}
                            mt={["-4.167vw", "-2.08vw"]}
                            // px={["10.55vw", "18.54vw"]}
                            px={["10.55vw", "8vw"]}
                            // py={["13.33vw","6.32vw"]}
                            py={["15vw", "8vw"]}
                            boxShadow={[
                                "0px -20px 25px 0px rgba(0,0,0,0.2)",
                                "0px -35px 25px 0px rgba(0,0,0,0.2)"
                            ]}
                        >
                            <Flex flexDirection={"column"}>
                                <Text fontSize={["6.4vw", "3.06vw"]} fontFamily={"lora"} fontStyle={"italic"} color={"primary_1"}>Testimonials</Text>

                                <Grid mt={["5.55vw", "3.472vw"]} templateColumns={["repeat(1,1fr)", "repeat(2,1fr)", "repeat(2,1fr)", "repeat(3, 1fr)"]} gap={["28px", "2.22vw"]} justifyItems="center"
                                    alignItems="center">
                                    {Array(1).fill(testimonials).flat()
                                        // .filter((item) => item != null) // Filter out null values
                                        .map((item, index) => (
                                            <GridItem w='100%' key={index}><TestimonialCard data={item} /></GridItem> // Wrap each item in a div
                                        ))}
                                </Grid>
                            </Flex>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default ExpertPage