import React, { useContext, useEffect, useState } from 'react'
import { ChakraNextImage } from '../../patterns/ChakraNextImage'
import { Box, Button, Flex, Link, Text, useBreakpointValue } from '@chakra-ui/react'
import ScrollableCarousel from './ScrollableCarousel'
import AppContext from '../AppContext'

const SmallUserCard = ({ userData, followed, onFollow }) => {
    const { profile } = useContext(AppContext)

    return (
        <Flex borderRadius={["2.78vw", "1.04vw"]} w={"100%"} h={"fit-content"} p={["7.22vw", "1.875vw"]} bg={'white'} flexDirection={"column"}>
            <Flex gap={["8.06vw", "2.15vw"]}>
                <ChakraNextImage minW={["27.22vw", "7.2vw"]} h={["27.22vw", "7.15vw"]} borderRadius={"100%"} src={userData?.profilePic?.url ? userData.profilePic.url : userData?.profilePicURL ? userData?.profilePicURL : "/assets/default-profile-pic.png"} objectFit={"cover"} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt={"profile pic"} />
                <Box cursor="default!important">
                    <Text as={Link} href={userData?.slug} target="_blank" mt={["1.11vw", "0.35vw"]} fontSize={["5vw", "1.32vw"]} color={"primary_3"} fontFamily={"lora"} fontWeight={600} fontStyle={"italic"}>{userData?.fullName}</Text>
                    <Text mt={["1vw", "0.30vw"]} fontSize={["2.5vw", "0.8vw"]} fontFamily={"raleway"}>POSTCARD TRAVELLER</Text>
                    {userData?.country?.name && <Text mt={["1vw", "auto"]} fontSize={["3.33vw", "0.9vw"]} fontWeight={600} fontFamily={"raleway"} color={"black"}>{userData.country.name}</Text>}

                    {userData?.social?.blogURL && <Text as={Link} fontSize={["2.5vw", "0.7vw"]} href={userData.social.blogURL} target="_blank" _hover={{ textDecoration: "underline" }} fontWeight={600} fontFamily={"raleway"} color={"primary_3"}>{userData.social.blogURL?.length > 30 ? userData.social.blogURL?.slice(0, 30) + '...' : userData.social.blogURL}</Text>}

                </Box>
            </Flex>

            <Box h={"1px"} bg={"#D3CECA"} w={"100%"} my={["3.33vw", "0.83vw"]}></Box>

            {userData?.bio && <Text cursor="default!important" w={"100%"} fontSize={["3.2vw", "1.0vw"]} fontFamily={"raleway"} fontWeight={500}>{userData.bio}</Text>}

            <Flex mt={["5vw", "1.5vw"]} p={["5vw", "1.4vw"]} justifyContent={"space-between"} w={"100%"} border={"2px"} borderRadius={["3.89vw", "1.04vw"]} borderColor={"primary_3"}>
                <Flex w={"100%"} justify={"space-between"} alignItems={"center"}>
                    <Text fontSize={["6.4vw", "1.67vw"]} color={"primary_3"} fontFamily={"lora"} >{userData?.bookmarkedCount || 0}</Text>
                    <Text fontSize={["3.06vw", "0.83vw"]} maxW={["19.44vw", "5.2vw"]} fontFamily={"raleway"} color={"#494746"} fontWeight={600}>Postcards Collected</Text>
                </Flex>

                <Box minH={"100%"} w={"3px"} bg={"primary_3"}></Box>

                <Flex w={"100%"} justify={"space-between"} alignItems={"center"} ml={"2vw"}>
                    <Text fontSize={["6.4vw", "1.67vw"]} color={"primary_3"} fontFamily={"lora"} >{userData?.bookmarkedCountries || 0}</Text>
                    <Text fontSize={["3.06vw", "0.83vw"]} maxW={["19.44vw", "5.2vw"]} fontFamily={"raleway"} color={"#494746"} fontWeight={600} >Countries Explored</Text>
                </Flex>
            </Flex>

            {profile?.id !== userData?.id && <Flex w={"100%"} gap={"3.9vw"} mt={["5vw", "1.5vw"]} >
                <Button fontSize={["3.7vw", "0.83vw"]} borderRadius={["8.33vw", "2.083vw"]} w={"50%"} h={["10vw", "2vw"]} border={"2px"} borderColor={"primary_3"} fontFamily={"raleway"} color={`${followed ? "white" : "primary_3"}`} bg={`${followed ? "primary_3" : "transparent"}`} variant={"none"} onClick={onFollow} _hover={{ bg: "primary_3", color: "white", borderColor: "primary_3" }} >{followed ? "Following" : "Follow"}</Button>
                <Button fontSize={["3.7vw", "0.83vw"]} borderRadius={["8.33vw", "2.083vw"]} w={"50%"} h={["10vw", "2vw"]} border={"2px"} fontFamily={"raleway"} color={"primary_3"} variant={"none"} _hover={{ bg: "primary_3", color: "white", borderColor: "primary_3" }} as={Link} href={userData?.slug} target="_blank">Visit Profile</Button>
            </Flex>}

            {userData?.coverImage &&
                <Box w={"100%"} h={["51.11vw", "13.61vw"]} mt={["5vw", "1.75vw"]}>
                    <ChakraNextImage borderRadius={["3.89vw", "1.04vw"]} src={userData?.coverImage?.url} objectFit={"cover"} alt={"UserCard Cover Image"} />
                </Box>
            }


        </Flex>
    )
}

export default SmallUserCard