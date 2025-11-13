import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Select, Text, Textarea, useToast } from '@chakra-ui/react'
import { ChakraNextImage } from '../../patterns/ChakraNextImage'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { getUrlOfUploadImage } from '../../services/utilities'
import { fetchPaginatedResults, getCountries, getExpertbyUserLink, updateDBValue } from '../../queries/strapiQueries'
import AppContext from '../AppContext'
import UploadCoverImage from './UploadCoverImage'
import { useCountries } from '../../hooks/useCountriesHook'

const EditUserCard = ({ userData, closeEditProfile, memCount }) => {
    const { profile, updateUser } = useContext(AppContext)
    const [charCount, setCharCount] = useState(0);
    const countries = useCountries('all')
    const [profilePic, setProfilePic] = useState(userData?.profilePic?.url || userData?.profilePicURL)
    const [profilePicId, setProfilePicId] = useState(userData?.profilePic?.id)
    const [coverImage, setCoverImage] = useState(userData?.coverImage || null)
    // const [coverImages, setCoverImages] = useState(["/assets/homepage/gallery_1.webp", "/assets/homepage/gallery_2.webp", "/assets/homepage/gallery_3.webp"])
    const [firstName, setFirstName] = useState(userData?.firstName || '');
    const [lastName, setLastName] = useState(userData?.lastName || '');
    const [country, setCountry] = useState(userData?.country?.id || null);
    const [blogUrl, setBlogUrl] = useState(userData?.social?.blogURL || '')
    const [bio, setBio] = useState(userData?.bio || '')

    const [isUrlValid, setIsUrlValid] = useState(true);

    const inputFileRef = useRef(null)
    const toast = useToast()
    const charLimit = 150;

    const validateUrl = (value) => {
        const urlPattern = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
        return urlPattern.test(value);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= charLimit) {
            setBio(value)
            setCharCount(value.length);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // console.log("Selected file:", file);
            getUrlOfUploadImage(file, (result) => {
                setProfilePic(result.url)
                setProfilePicId(result.id)
            })

        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                firstName,
                lastName,
                fullName: firstName + " " + lastName,
                country,
                // social: { blogURL: blogUrl },
                bio,
                profilePic: profilePicId,
                coverImage: coverImage?.id,
            }
            updateDBValue('users', userData.id, payload).then(async (response) => {
                const user = await getExpertbyUserLink(userData.slug)
                await updateUser(Array.isArray(user) ? user[0] : user)
            })
            closeEditProfile()
        } catch (err) {
            // console.log(err)
        }
    }

    return (
        <Flex w={["100%", "80.20vw"]} gap={["8.05vw", 0]} h={["100%", "auto"]} bg={"#EFE9E4"} borderRadius={["4.167vw", "2.083vw"]} p={["5.55vw", "3.75vw"]} justifyContent={"space-between"} flexDirection={["column", "row"]} boxShadow={"16px -14px 15px -3px rgba(0,0,0,0.1)"} >
            <Box display="flex" flexDirection="column" h="100%">
                <Flex w={["100%", "41.04vw"]} gap={["5.8vw", "2.84vw"]}>
                    <Box>
                        <ChakraNextImage w={["29vw", "12.64vw"]} h={["29vw", "12.64vw"]} borderRadius={"100%"} src={profilePic ? profilePic : "/assets/default-profile-pic.png"} objectFit={"cover"} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt={"profile pic"} />
                        <>
                            <Text
                                fontSize={"1.2vw"}
                                mt={"0.7vw"}
                                w={"100%"}
                                textAlign={"center"}
                                color={"primary_3"}
                                fontFamily={"raleway"}
                                cursor={"pointer"}
                                onClick={() => inputFileRef.current.click()}
                            >
                                Edit Picture
                            </Text>
                            <Input
                                type="file"
                                ref={inputFileRef}
                                display="none" // Hide the file input
                                onChange={handleFileChange}
                                accept="image/*" // Restrict to image files only
                            />
                        </>
                    </Box>

                    <Box flex={1}>
                        <Flex justifyContent={"space-between"}>
                            <FormControl isRequired isInvalid={!firstName}>
                                <FormLabel mb={1} fontSize={"1vw"} color={"primary_3"} fontFamily={"raleway"} sx={{
                                    "& .chakra-form__required-indicator": {
                                        fontSize: "1.5em", // Adjust the size
                                        color: "red",      // Change the color
                                        fontWeight: "bold",
                                    },
                                }}>
                                    First Name
                                </FormLabel>
                                <Input type='text' fontSize={"1.2vw"} fontWeight={600} w={"11.18vw"} h={"2.5vw"} borderRadius={"0.7vw"} border={"2px"} borderColor={"primary_3"} color={"primary_3"}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={!lastName}>
                                <FormLabel mb={1} fontSize={"1vw"} color={"primary_3"} fontFamily={"raleway"} sx={{
                                    "& .chakra-form__required-indicator": {
                                        fontSize: "1.5em", // Adjust the size
                                        color: "red",      // Change the color
                                        fontWeight: "bold",
                                    },
                                }}>
                                    Last Name
                                </FormLabel>
                                <Input type='text' fontSize={"1.2vw"} fontWeight={600} w={"11.18vw"} h={"2.5vw"} borderRadius={"0.7vw"} border={"2px"} borderColor={"primary_3"} color={"primary_3"}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </FormControl>
                        </Flex>

                        <FormControl mt={"1.18vw"} isRequired isInvalid={!country}>
                            <FormLabel mb={1} fontSize={"1vw"} color={"primary_3"} fontFamily={"raleway"} sx={{
                                "& .chakra-form__required-indicator": {
                                    fontSize: "1.5em", // Adjust the size
                                    color: "red",      // Change the color
                                    fontWeight: "bold",
                                },
                            }}>
                                Country
                            </FormLabel>
                            <Select w={"11.18vw"} h={"2.5vw"} borderRadius={"0.7vw"} border={"2px"} borderColor={"primary_3"} color={"#9C9895"} placeholder='Select country' fontSize={"1.2vw"}
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            >
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        {/* <FormControl mt={"1.18vw"} isInvalid={!isUrlValid}>
                            <FormLabel mb={1} fontSize={"1vw"} color={"primary_3"} fontFamily={"raleway"}>Custom Link</FormLabel>
                            <Input type='text' fontSize={"1.2vw"} w={"100%"} h={"2.5vw"} borderRadius={"0.7vw"} border={"2px"} borderColor={"primary_3"} color={"primary_3"} fontWeight={"600"}

                                value={blogUrl}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const isValid = validateUrl(value);
                                    setBlogUrl(value)
                                    setIsUrlValid(isValid);
                                }}
                            />
                            {!isUrlValid && (
                                <FormErrorMessage fontSize={"0.83vw"}>Please enter a valid URL.</FormErrorMessage>
                            )}
                        </FormControl> */}
                    </Box>
                </Flex>

                <Box display={{ base: "flex", sm: "none" }} h={"1px"} w={"100%"} bg={"#D3CECA"} mt={["2.6vw", "0.937vw"]}></Box>

                <FormControl mt={"1.18vw"}>
                    <FormLabel
                        mb={1}
                        fontSize={"1vw"}
                        color={"primary_3"}
                        fontFamily={"raleway"}
                    >
                        Bio
                    </FormLabel>
                    <Box position="relative" >
                        <Textarea
                            w={"100%"}
                            minH={"7vw"}
                            fontSize={"1.2vw"}
                            borderRadius={"0.7vw"}
                            border={"2px"}
                            borderColor={"primary_3"}
                            value={bio}
                            onChange={handleInputChange}
                            maxLength={charLimit}
                            placeholder='Write here'
                            className='no-scrollbar'
                        />
                        <Text
                            fontSize={"0.9vw"}
                            color="gray.500"
                            position="absolute"
                            bottom="0.3vw"
                            right="0.5vw"
                            fontFamily={"raleway"}
                        >
                            {charCount}/{charLimit}
                        </Text>
                    </Box>
                </FormControl>

                {/* The Flex takes remaining space and ensures the buttons stay at the bottom */}
                {/* <Flex display={{ base: "none", sm: "flex" }} mt="5%" flex="1" justifyContent="flex-end" flexDirection="column" >
                    <Flex gap={"1.4vw"}>
                        <Button onClick={handleSubmit} isDisabled={!firstName || !lastName || !country} fontSize={"1.4vw"} px={"3.75vw"} h={"3.61vw"} borderRadius={"2.78vw"} border={"2px"} fontFamily={"raleway"} color={"white"} variant={"none"} bg={"primary_3"} borderColor={"primary_3"} >Submit</Button>
                    </Flex>
                </Flex> */}
            </Box >

            {/* Desktop */}
            < Flex display={{ base: "none", sm: "flex" }} flexDirection={"column"} justify={"space-between"} w={"25.2vw"} gap={"1.606vw"} >
                {/* <ChakraNextImage borderRadius={"2.083vw"} w={"100%"} h={"18.75vw"} src={"/assets/homepage/gallery_1.webp"} objectFit={"cover"} /> */}
                {/* < Box h={"55%"} order={1} borderRadius={["4.167vw", "2.083vw"]} >
                    <UploadCoverImage isOwner={profile?.id == userData?.id} coverImage={userData?.coverImage} />
                </Box > */}

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

                <Button onClick={handleSubmit} isDisabled={!firstName || !lastName || !country} fontSize={"1.4vw"} px={"3.75vw"} h={"3.61vw"} borderRadius={"2.78vw"} border={"2px"} fontFamily={"raleway"} color={"white"} variant={"none"} bg={"primary_3"} borderColor={"primary_3"} >Submit</Button>
            </Flex >

            {/* Mobile */}
            < Flex display={{ base: "flex", sm: "none" }} flexDirection={"column"} gap={"5vw"} >
                <Flex justifyContent={"space-between"} w={"100%"} px={"5vw"} py={"4.7vw"} h={"19vw"} border={"2px"} borderRadius={"4.167vw"} gap={"3vw"} borderColor={"primary_3"}>
                    <Flex w={"100%"} justify={"space-between"} alignItems={"center"}>
                        <Text fontSize={"6.67vw"} color={"primary_3"} fontFamily={"lora"} >{userData?.bookmarkedCount}</Text>
                        <Text fontSize={"3.33vw"} maxW={"18vw"} fontFamily={"raleway"} color={"#494746"} fontWeight={600}>Postcards Collected</Text>
                    </Flex>

                    <Box h={"100%"} w={"2px"} bg={"primary_3"}></Box>

                    <Flex w={"100%"} justify={"space-between"} alignItems={"center"}>
                        <Text fontSize={"6.67vw"} color={"primary_3"} fontFamily={"lora"} >{memCount}</Text>
                        <Text fontSize={"3.33vw"} maxW={"18vw"} fontFamily={"raleway"} color={"#494746"} fontWeight={600} >Postcard Memories</Text>
                    </Flex>
                </Flex>

                <Flex w={"100%"} gap={"3.9vw"}>
                    <Button isDisabled={!firstName || !lastName || !country} fontSize={"3.33vw"} w={"50%"} h={"7.22vw"} borderRadius={"4.167vw"} border={"2px"} fontFamily={"raleway"} color={"primary_3"} borderColor={"primary_3"} variant={"none"} _hover={{ bg: "primary_3", color: "white" }} onClick={handleSubmit} >Submit</Button>
                </Flex>
            </Flex >

            {/* Mobile */}
            < Box h={"54.44vw"} borderRadius={["4.167vw", "2.083vw"]} display={{ base: "flex", sm: "none" }}>
                <UploadCoverImage isOwner={profile?.id == userData?.id} coverImage={userData?.coverImage} />
            </Box >

        </Flex >
    )
}

export default EditUserCard