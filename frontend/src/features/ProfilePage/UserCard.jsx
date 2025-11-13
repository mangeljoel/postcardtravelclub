import React, { useContext, useEffect, useState } from 'react'
import { ChakraNextImage } from '../../patterns/ChakraNextImage'
import { Box, Button, Flex, Link, Text, useBreakpointValue, useToast } from '@chakra-ui/react'
import AppContext from '../AppContext'
import EditProfileMobilePopup from './EditProfileMobilePopup'
import { createDBEntry, deleteDBEntry } from '../../queries/strapiQueries'
import strapi from '../../queries/strapi'
import { CheckCircleIcon } from '@chakra-ui/icons'
import UploadCoverImage from './UploadCoverImage'
import { useSignupModal } from '../SignupModalContext'

const UserCard = ({ userData, editProfile, memCount }) => {
    const { profile } = useContext(AppContext)
    const { openLoginModal } = useSignupModal()
    const [followId, setFollowId] = useState(null)
    const [isUrlCopied, setIsUrlCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const maxChars = 150;
    const [editProfileMobile, setEditProfileMobile] = useState(false)
    const openModal = () => setEditProfileMobile(true);
    const closeModal = () => setEditProfileMobile(false);
    // Determine if the device is mobile or desktop based on screen size
    const isMobile = useBreakpointValue({ base: true, md: false });
    const toast = useToast()

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleShareClick = () => {
        const currentUrl = window.location.href;

        // If mobile and navigator.share is supported, use the native share API
        if (isMobile && navigator.share) {
            navigator.share({
                title: document.title,
                url: currentUrl,
            })
        } else {
            // For desktop or when share is unavailable, copy the URL to clipboard
            try {
                navigator.clipboard.writeText(currentUrl)
                    .then(() => {
                        toast({
                            title: `Link Copied`,
                            status: 'success',
                            isClosable: true,
                            position: 'top',
                            variant: "subtle"
                        })
                    })
                    .catch((err) => {
                        // console.log('Error copying URL:', err);
                    });
            } catch (err) {
                // console.log('Error:', err);
            }
        }
    };

    const handleFollowUser = () => {
        if (profile) {
            if (profile?.id && userData?.id) {
                if (followId) {
                    deleteDBEntry('follows', followId).then(response => setFollowId(null))

                }
                else {
                    createDBEntry('follows', { follower: profile.id, following: userData.id }).then(response => {
                        if (response.data?.id) {
                            setFollowId(response.data.id)
                            createDBEntry("events", {
                                event_master: 7,
                                user: profile.id,
                                following: userData.id
                            });
                        }
                    })
                }
            }
        }
        else {
            openLoginModal()
        }
    }

    useEffect(() => {

        if (profile && userData && profile?.id !== userData?.id) {
            strapi.find('follows', {
                filters: {
                    follower: profile.id,
                    following: userData.id
                }
            }).then(response => {
                // console.log(response)
                if (response.data?.length > 0) setFollowId(response.data[0].id)
            })
        }

    }, [profile, userData])


    return (
        <Flex w={["100%", "80.20vw"]} gap={["8.05vw", 0]} h={["90%", "auto"]} bg={"#EFE9E4"} borderRadius={["4.167vw", "2.083vw"]} p={["5.55vw", "3.75vw"]} justifyContent={"space-between"} flexDirection={["column", "row"]} boxShadow={["5px -5px 5px -3px rgba(0,0,0,0.1)", "16px -14px 15px -3px rgba(0,0,0,0.1)"]} >

            <EditProfileMobilePopup userData={userData} isOpen={editProfileMobile} openModal={openModal} closeModal={closeModal} />

            <Box display="flex" flexDirection="column" h={["fit-content", "100%"]}>
                <Flex w={["100%", "39.51vw"]} gap={["5.8vw", "3.53vw"]}>
                    <ChakraNextImage w={["29vw", "12.85vw"]} minW={["29vw", "12.85vw"]} h={["29vw", "12.85vw"]} borderRadius={"100%"} src={userData?.profilePic?.url ? userData.profilePic.url : userData?.profilePicURL ? userData?.profilePicURL : "/assets/default-profile-pic.png"} fallbackImg={"/assets/default-profile-pic.png"} objectFit={"cover"} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt={"profile pic"} />
                    <Box cursor="default!important">
                        <Text fontSize={["5.3vw", "2.64vw"]} lineHeight={["8.88vw", "2.85vw"]} mt={["4vw", "2.78vw"]} color={"primary_3"} fontFamily={"lora"} fontWeight={600} fontStyle={"italic"}>{userData?.fullName}</Text>
                        <Text fontSize={["2.78vw", "1.25vw"]} mt={"0.5vw"} fontFamily={"raleway"}>POSTCARD TRAVELLER</Text>
                        {userData?.country?.name && <Text fontSize={["3.61vw", "1.25vw"]} mt={["0.7vw", "0.50vw"]} fontWeight={600} fontFamily={"raleway"} color={"black"}>{userData.country.name}</Text>}
                        {/* {!userData?.country?.name && userData?.id == profile?.id && <Text fontSize={["2.61vw", "1.25vw"]} mt={["0.7vw", "0.50vw"]} fontWeight={600} fontFamily={"raleway"} color={"black"} opacity={0.4} onClick={editProfile}>* Your Country will go here *</Text>} */}
                        <Flex alignItems={"center"} mt={["0.7vw", "0.50vw"]}>
                            {userData?.social?.blogURL && <Text as={Link} href={userData.social.blogURL} target="_blank" _hover={{ textDecoration: "underline" }} fontSize={["2.7vw", "1.04vw"]} fontWeight={600} fontFamily={"raleway"} color={"primary_3"}>{userData.social.blogURL}</Text>}
                            {/* {!userData?.social?.blogURL && userData?.id == profile?.id && <Text fontSize={["2.7vw", "1.04vw"]} fontWeight={600} fontFamily={"raleway"} color={"primary_3"} opacity={0.4} onClick={editProfile}>* Your Custom link will go here *</Text>} */}
                        </Flex>
                    </Box>
                </Flex>

                <Box display={{ base: "flex", sm: "none" }} h={"1px"} w={"100%"} bg={"#D3CECA"} mt={["2.6vw", "0.937vw"]}></Box>

                {/* {userData?.bio && <Text cursor="default!important" maxW={["100%", "39.51vw"]} fontSize={["3.5vw", "1.4vw"]} mt={["2.6vw", "1.875vw"]} fontFamily={"raleway"} fontWeight={500}>{userData.bio}</Text>} */}
                {userData?.bio && <Box
                    cursor="default!important"
                    maxW={["100%", "39.51vw"]}
                    fontSize={["3.5vw", "1.4vw"]}
                    mt={["2.6vw", "1.875vw"]}
                    fontFamily={"raleway"}
                    fontWeight={500}
                    overflow={isExpanded ? "auto" : "hidden"}
                    maxHeight={isExpanded ? "7em" : ["6em", "4.5em"]} // Adjust based on expected number of lines
                    position="relative"
                >
                    <Text>
                        {isExpanded
                            ? userData?.bio
                            : `${userData?.bio.slice(0, maxChars)}${userData?.bio.length > maxChars ? "..." : ""}`}
                        {userData?.bio.length > maxChars && (
                            <Text
                                as="span"
                                color={"blue.500"}
                                cursor="pointer"
                                onClick={handleToggle}
                            >
                                {isExpanded ? " Show Less" : " Read More"}
                            </Text>
                        )}
                    </Text>
                </Box>}
                {/* {!userData?.bio && userData?.id == profile?.id && <Text cursor="default!important" maxW={["100%", "39.51vw"]} fontSize={["3vw", "1.4vw"]} mt={["2.6vw", "1.875vw"]} fontFamily={"raleway"} fontWeight={500} opacity={0.4} onClick={editProfile}>* Your bio will go here *</Text>} */}

                {/* The Flex takes remaining space and ensures the buttons stay at the bottom */}
                {/* <Flex display={{ base: "none", sm: "flex" }} flex="1" justifyContent="flex-end" flexDirection="column">
                    <Flex gap={"1.4vw"}>

                        {userData?.id == profile?.id && <Button fontSize={"1.4vw"} px={"3.75vw"} h={"3.61vw"} borderRadius={"2.78vw"} border={"2px"} fontFamily={"raleway"} color={"primary_3"} variant={"none"} _hover={{ bg: "primary_3", color: "white", borderColor: "primary_3" }} onClick={editProfile}>Edit Profile</Button>}
                        {userData?.id !== profile?.id && <Button fontSize={"1.4vw"} px={"3.75vw"} h={"3.61vw"} borderRadius={"2.78vw"} border="2px" borderColor={"primary_3"} fontFamily={"raleway"} color={`${followId ? "white" : "primary_3"}`} bg={`${followId ? "primary_3" : "transparent"}`} variant={"none"} onClick={handleFollowUser}>{followId ? "Following" : "Follow"}</Button>}
                        <Button fontSize={"1.4vw"} px={"3.75vw"} h={"3.61vw"} borderRadius={"2.78vw"} border={"2px"} fontFamily={"raleway"} color={"primary_3"} variant={"none"} _hover={{ bg: "primary_3", color: "white", borderColor: "primary_3" }} onClick={handleShareClick} >Share</Button>
                    </Flex>
                </Flex> */}
            </Box >

            <Flex display={{ base: "none", sm: "flex" }} flexDirection={"column"} justify={"space-between"} w={"25.2vw"} gap={"1.606vw"}>
                {/* <ChakraNextImage borderRadius={"2.083vw"} w={"100%"} h={"18.75vw"} src={"/assets/homepage/gallery_1.webp"} objectFit={"cover"} /> */}
                {/* <Box h={"55%"} order={1} borderRadius={["4.167vw", "2.083vw"]}>
                    <UploadCoverImage isOwner={profile?.id == userData?.id} coverImage={userData?.coverImage} />

                </Box> */}

                <Flex flexDirection={"column"} w="100%" border={"2px"} borderColor={"primary_3"} px={"3.33vw"} py={"1.54vw"} borderRadius={"2.083vw"} justify={"space-around"}>
                    <Flex justify={"space-between"} alignItems={"center"} >
                        <Text fontSize={"3.411vw"} color={"primary_3"} fontFamily={"lora"} >{userData?.bookmarkedCount}</Text>
                        <Text fontSize={"1.2vw"} maxW={"7vw"} fontFamily={"raleway"} color={"#494746"}>Postcards Collected</Text>
                    </Flex>
                    <Box h={"2px"} bg={"primary_3"}></Box>
                    <Flex justify={"space-between"} alignItems={"center"}>
                        <Text fontSize={"3.411vw"} color={"primary_3"} fontFamily={"lora"} >{memCount}</Text>
                        <Text fontSize={"1.2vw"} maxW={"7vw"} fontFamily={"raleway"} color={"#494746"}>Postcard Memories</Text>
                    </Flex>

                </Flex>

                <Flex gap={"1.4vw"}>

                    {userData?.id == profile?.id && <Button fontSize={"1.4vw"} px={"3.75vw"} h={"3.61vw"} borderRadius={"2.78vw"} border={"2px"} fontFamily={"raleway"} color={"primary_3"} variant={"none"} _hover={{ bg: "primary_3", color: "white", borderColor: "primary_3" }} onClick={editProfile}>Edit Profile</Button>}
                    {userData?.id !== profile?.id && <Button fontSize={"1.4vw"} px={"3.75vw"} h={"3.61vw"} borderRadius={"2.78vw"} border="2px" borderColor={"primary_3"} fontFamily={"raleway"} color={`${followId ? "white" : "primary_3"}`} bg={`${followId ? "primary_3" : "transparent"}`} variant={"none"} onClick={handleFollowUser}>{followId ? "Following" : "Follow"}</Button>}
                    <Button fontSize={"1.4vw"} px={"3.75vw"} h={"3.61vw"} borderRadius={"2.78vw"} border={"2px"} fontFamily={"raleway"} color={"primary_3"} variant={"none"} _hover={{ bg: "primary_3", color: "white", borderColor: "primary_3" }} onClick={handleShareClick} >Share</Button>
                </Flex>
            </Flex>

            <Flex display={{ base: "flex", sm: "none" }} flexDirection={"column"} gap={"5vw"}>
                <Flex justifyContent={"space-between"} w={"100%"} px={"2vw"} py={"4.7vw"} h={"19vw"} border={"2px"} borderRadius={"4.167vw"} gap={"3vw"} borderColor={"primary_3"}>
                    <Flex w={"100%"} justify={"space-between"} alignItems={"center"}>
                        <Text fontSize={"6.67vw"} color={"primary_3"} fontFamily={"lora"} >{userData?.bookmarkedCount}</Text>
                        <Text fontSize={"3.33vw"} maxW={"18vw"} fontFamily={"raleway"} color={"#494746"} fontWeight={600}>Postcards Collected</Text>
                    </Flex>

                    <Box h={"100%"} w={"2px"} bg={"primary_3"}></Box>

                    <Flex w={"100%"} justify={"space-between"} alignItems={"center"} ml={"2vw"}>
                        <Text fontSize={"6.67vw"} color={"primary_3"} fontFamily={"lora"} >{memCount}</Text>
                        <Text fontSize={"3.33vw"} maxW={"18vw"} fontFamily={"raleway"} color={"#494746"} fontWeight={600} >Postcard Memories</Text>
                    </Flex>
                </Flex>

                <Flex w={"100%"} gap={"3.9vw"}>

                    {userData?.id == profile?.id && <Button fontSize={"3.33vw"} w={"50%"} h={"7.6vw"} borderRadius={"4.167vw"} border={"2px"} fontFamily={"raleway"} color={"primary_3"} variant={"none"} _hover={{ bg: "primary_3", color: "white", borderColor: "primary_3" }} onClick={openModal}>Edit Profile</Button>}
                    {userData?.id !== profile?.id && <Button fontSize={"3.33vw"} w={"50%"} h={"7.6vw"} borderRadius={"4.167vw"} border={"2px"} borderColor={"primary_3"} fontFamily={"raleway"} color={`${followId ? "white" : "primary_3"}`} bg={`${followId ? "primary_3" : "transparent"}`} variant={"none"} onClick={handleFollowUser}>{followId ? "Following" : "Follow"}</Button>}
                    <Button fontSize={"3.33vw"} w={"50%"} h={"7.6vw"} borderRadius={"4.167vw"} border={"2px"} fontFamily={"raleway"} color={"primary_3"} variant={"none"} _hover={{ bg: "primary_3", color: "white", borderColor: "primary_3" }} onClick={handleShareClick}>Share</Button>
                </Flex>
            </Flex>

            {/* {
                (userData?.id === profile?.id || userData?.coverImage > 0) && < Box h={"54.44vw"} borderRadius={["4.167vw", "2.083vw"]} display={{ base: "flex", sm: "none" }}>
                    <UploadCoverImage isOwner={profile?.id == userData?.id} coverImage={userData?.coverImage} />
                </Box>
            } */}

        </Flex >
    )
}

export default UserCard