import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import React, { useContext } from 'react'
import RenderMarkdown from '../../../patterns/RenderMarkdown'
import { ChakraNextImage } from '../../../patterns/ChakraNextImage'
import TestimonialCard from './TestimonialCard'
import { customMarkdown } from '../index.module.scss';
import AppContext from '../../AppContext'
import ActionItemsDestinationExpert from '../ActionItemsDestinationExpert'
import { updateDBValue } from '../../../queries/strapiQueries'

const DxAbout = ({ data, showActionButton, isFooterInView, editMode, setEditMode, formikRef, handleSubmit }) => {
    const { profile } = useContext(AppContext)
    return (
        <>
            <Box w={"100%"} mt={["2vw", "3vw"]}>

                <Box
                    id={"Founder's Message"}
                    w={"100%"}
                    bg={"primary_1"}
                    px={["12.22vw", "8.5vw"]}
                    py={["10.83vw", "6.875vw"]}
                    borderTopRadius={["4.167vw", "2.08vw"]}
                >
                    <Flex flexDirection={"column"}>
                        <Text
                            color={"#EFE9E4"}
                            fontFamily={"lora"}
                            fontStyle={"italic"}
                            fontSize={["7.78vw", "3.06vw"]}
                        >
                            Founder's Message
                        </Text>

                        <Box
                            h={["1px", "2px"]}
                            my={["6.94vw", "3.125vw"]}
                            w={"100%"}
                            bg={"#EFE9E4"}
                        ></Box>

                        <Flex
                            mt={["0vw", "2.57vw"]}
                            justifyContent={"space-between"}
                            flexDirection={["column-reverse", "row"]}
                            gap={"5vw"}
                        >
                            <Flex
                                flex={1}
                                flexDirection={"column"}
                                w={["100%", "52.85vw"]}
                                className={customMarkdown}
                            >
                                {/* <Text color={"#EFE9E4!important"} >{content.data}</Text> */}
                                <RenderMarkdown
                                    content={data?.founderMessage?.founderBrief}
                                    color={"#EFE9E4"}
                                />
                            </Flex>

                            <Flex bg={"#EFE9E4"} w={["80vw", "25vw"]} h={["80vw", "25vw"]} borderRadius={"100%"} p={["2vw", "0.7vw"]}>
                                {/* <ChakraNextImage w={"100%"} h={"100%"} borderRadius={"100%"} objectFit={"cover"} src={data?.founderMessage?.founderImage?.url} alt={"Founder's Image"} /> */}
                                <Box borderRadius={"100%"} w={"100%"} h={"100%"} bgImage={data?.founderMessage?.founderImage?.url} bgSize={"cover"} bgRepeat={"no-repeat"} bgPos={"top"}></Box>
                            </Flex>
                        </Flex>
                    </Flex>
                </Box>

                {data?.dxSections?.map((content, index) => {
                    return (<Box
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
                                borderTopRadius={["4.167vw", "2.08vw"]}
                                mt={["-4.167vw", "-2.08vw"]}
                                px={["0", "18.54vw"]}
                                py={["15vw", "8vw"]}
                                boxShadow={index > 0 && ["0px -20px 25px 0px rgba(0,0,0,0.2)", "0px -35px 25px 0px rgba(0,0,0,0.2)"]}
                            >
                                <Text
                                    color={"primary_1"}
                                    fontFamily={"lora"}
                                    px={["10.55vw", "0"]}
                                    fontStyle={"italic"}
                                    fontSize={["6.5vw", "3.06vw"]}
                                    lineHeight={["8.5vw", "4vw"]}
                                >
                                    {content?.dx_section?.title}
                                </Text>

                                {content?.media?.length > 0 && (
                                    <>
                                        {/* DESKTOP: Full-width Grid for 1 or 2 images */}
                                        <Box
                                            display={["none", content.media.length < 3 ? "grid" : "none"]}
                                            px="0"
                                            my={16}
                                            gridTemplateColumns={`repeat(${content.media.length}, 1fr)`}
                                            gap={6}
                                            w="100%"
                                        >
                                            {content.media.map((image, index) => (
                                                <Box
                                                    key={index}
                                                    // maxH={["184px", "368px"]}
                                                    // width={["75vw", "auto"]}
                                                    // maxW={["256px", "512px"]}
                                                    w="100%"
                                                    aspectRatio="4 / 3"
                                                    borderRadius="20px"
                                                    overflow="hidden"
                                                >
                                                    <ChakraNextImage
                                                        src={image?.url}
                                                        w="100%"
                                                        h="100%"
                                                        objectFit="cover"
                                                        alt={`Section Media Image: ${index}`}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>

                                        {/* SCROLLABLE layout for mobile always, desktop only if 3+ images */}
                                        <Box
                                            display={["flex", content.media.length >= 3 ? "flex" : "none"]}
                                            px={["11.55vw", "0"]}
                                            my={[8, 8, 16]}
                                            overflowX="auto"
                                            whiteSpace="nowrap"
                                            className="no-scrollbar"
                                        >
                                            {content.media.map((image, index) => (
                                                <Box
                                                    as="span"
                                                    key={index}
                                                    display="inline-block"
                                                    mr={4}
                                                    height="auto"
                                                    maxH={["184px", "368px"]}
                                                    minW={["75vw", "340px"]} // minimum width for scrolling items
                                                    maxW={["256px", "512px"]}
                                                    aspectRatio="4 / 3"
                                                    borderRadius="20px"
                                                    overflow="hidden"
                                                >
                                                    <ChakraNextImage
                                                        w="100%"
                                                        h="100%"
                                                        src={image?.url}
                                                        objectFit="cover"
                                                        alt={"Section Media Image: " + index}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    </>
                                )}

                                <Flex
                                    flexDirection={"column"}
                                    px={["10.55vw", "0"]}
                                >
                                    <Box className={customMarkdown}>
                                        <RenderMarkdown
                                            content={content.content}
                                        />
                                    </Box>
                                </Flex>
                            </Box>
                        </Box>
                    </Box>
                    )
                })}

                {data?.testimonials?.length > 0 && <Box
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
                                    {data?.testimonials?.map((item, index) => (
                                        <GridItem w='100%' key={index}><TestimonialCard data={item} /></GridItem> // Wrap each item in a div
                                    ))}
                                </Grid>
                            </Flex>
                        </Box>
                    </Box>
                </Box>}
            </Box>

            {
                profile && showActionButton && (
                    <Flex
                        id="ActionItemsDestinationExpert"
                        w="15%"
                        // h="15%"
                        right={0}
                        bottom={!isFooterInView ? 8 : 8}
                        pos={!isFooterInView ? "fixed" : "absolute"}
                        zIndex={102}
                        justifyContent={"center"}
                        alignItems={!isFooterInView ? "center" : "flex-end"}
                    >
                        <ActionItemsDestinationExpert status={data?.status} editMode={editMode} setEditMode={setEditMode} formikRef={formikRef} handleSubmit={handleSubmit}
                            handleUnpublish={async () => {
                                await updateDBValue('destination-experts', data?.id, { status: "draft" })
                                setEditMode(true)
                            }} />
                    </Flex>
                )
            }
        </>
    )
}

export default DxAbout