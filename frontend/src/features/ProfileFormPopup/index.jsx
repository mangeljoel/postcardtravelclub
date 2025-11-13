import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, Flex, Box, Text, Input, FormControl, FormLabel, Select, Textarea, Button } from "@chakra-ui/react";
import EditUserCard from '../ProfilePage/EditUserCard'
import { getExpertbyUserLink, updateDBValue } from "../../queries/strapiQueries";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
import { getUrlOfUploadImage } from "../../services/utilities";
import { useCountries } from "../../hooks/useCountriesHook";

const ProfileFormPopup = ({ open, profile, updateUser }) => {
    const charLimit = 150;
    const countries = useCountries('all')
    const [userData, setUserData] = useState(null)
    const [profilePic, setProfilePic] = useState('')
    const [profilePicId, setProfilePicId] = useState(null)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [country, setCountry] = useState(null);
    const [bio, setBio] = useState('')
    const [charCount, setCharCount] = useState(0);
    const inputFileRef = useRef(null)

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

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= charLimit) {
            setBio(value)
            setCharCount(value.length);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                firstName,
                lastName,
                fullName: firstName + " " + lastName,
                country,
                bio,
                profilePic: profilePicId,
            }
            updateDBValue('users', userData.id, payload).then(async (response) => {
                const user = await getExpertbyUserLink(userData.slug)
                await updateUser(Array.isArray(user) ? user[0] : user)
            })
            // closeEditProfile()
        } catch (err) {
            // console.log(err)
        }
    }

    useEffect(() => {
        getExpertbyUserLink(profile?.slug).then((response) => {
            const data = Array.isArray(response) ? response[0] : response
            setUserData(data)
            setProfilePic(data?.profilePic?.url || data?.profilePicURL)
            setProfilePicId(data?.profilePic?.id)
            setFirstName(data?.firstName || '')
            setLastName(data?.lastName || '')
            setCountry(data?.country?.id || null)
            setBio(data?.bio || '')
        })
    }, [profile])

    return (
        <Modal isOpen={open} onClose={() => { }} isCentered>
            <ModalOverlay />
            <ModalContent maxWidth={"fit-content"} maxH={"fit-content"} borderRadius={["4.167vw", "2.083vw"]} >
                <ModalBody display={"flex"} justifyContent={"center"} p={0} >
                    <Flex w={["80vw", "50.20vw"]} gap={["8.05vw", 0]} h={["100%"]} bg={"#EFE9E4"} borderRadius={["4.167vw", "2.083vw"]} p={["5.55vw", "3.75vw"]} justifyContent={"space-between"} flexDirection={["column", "row"]} >
                        <Box display="flex" flexDirection="column" h="100%">
                            <Flex w={["100%", "41.04vw"]} gap={["5.8vw", "2.84vw"]} flexDirection={["column", 'row']}>
                                <Box>
                                    <ChakraNextImage w={["29vw", "12.64vw"]} h={["29vw", "12.64vw"]} borderRadius={"100%"} mx={"auto"} src={profilePic ? profilePic : "/assets/default-profile-pic.png"} objectFit={"cover"} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt={"profile pic"} />
                                    <>
                                        <Text
                                            fontSize={["2.78vw", "1.2vw"]}
                                            mt={["2vw", "0.7vw"]}
                                            w={"100%"}
                                            textAlign={"center"}
                                            color={"primary_3"}
                                            fontFamily={"raleway"}
                                            cursor={"pointer"}
                                            onClick={() => inputFileRef.current.click()}
                                        >
                                            Change Picture
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
                                            <FormLabel mb={1} fontSize={["2.78vw", "1vw"]} color={"primary_3"} fontFamily={"raleway"} sx={{
                                                "& .chakra-form__required-indicator": {
                                                    fontSize: "1.5em", // Adjust the size
                                                    color: "red",      // Change the color
                                                    fontWeight: "bold",
                                                },
                                            }}>
                                                First Name
                                            </FormLabel>
                                            <Input type='text' fontSize={["3vw", "1.2vw"]} fontWeight={600} w={["31.67vw", "11.18vw"]} h={["8.88vw", "2.5vw"]} borderRadius={["2.7vw", "0.7vw"]} border={"2px"} borderColor={"primary_3"} color={"primary_3"}
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl isRequired isInvalid={!lastName}>
                                            <FormLabel mb={1} fontSize={["2.78vw", "1vw"]} color={"primary_3"} fontFamily={"raleway"} sx={{
                                                "& .chakra-form__required-indicator": {
                                                    fontSize: "1.5em", // Adjust the size
                                                    color: "red",      // Change the color
                                                    fontWeight: "bold",
                                                },
                                            }}>
                                                Last Name
                                            </FormLabel>
                                            <Input type='text' fontSize={["3vw", "1.2vw"]} fontWeight={600} w={["31.67vw", "11.18vw"]} h={["8.88vw", "2.5vw"]} borderRadius={["2.7vw", "0.7vw"]} border={"2px"} borderColor={"primary_3"} color={"primary_3"}
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </FormControl>
                                    </Flex>

                                    <FormControl mt={"1.18vw"} isRequired isInvalid={!country}>
                                        <FormLabel mb={1} fontSize={["2.78vw", "1vw"]} color={"primary_3"} fontFamily={"raleway"} sx={{
                                            "& .chakra-form__required-indicator": {
                                                fontSize: "1.5em", // Adjust the size
                                                color: "red",      // Change the color
                                                fontWeight: "bold",
                                            },
                                        }}>
                                            Country
                                        </FormLabel>
                                        <Select fontSize={["3vw", "1.2vw"]} w={["50vw", "14.18vw"]} h={["8.88vw", "2.5vw"]} borderRadius={["2.7vw", "0.7vw"]} border={"2px"} borderColor={"primary_3"} color={"#9C9895"} placeholder='Select country'
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
                                </Box>
                            </Flex>

                            <Box display={{ base: "flex", sm: "none" }} h={"1px"} w={"100%"} bg={"#D3CECA"} mt={["2.6vw", "0.937vw"]}></Box>

                            <FormControl mt={"1.18vw"}>
                                <FormLabel
                                    mb={1}
                                    fontSize={["2.78vw", "1vw"]}
                                    color={"primary_3"}
                                    fontFamily={"raleway"}
                                >
                                    Bio
                                </FormLabel>
                                <Box position="relative" >
                                    <Textarea
                                        w={"100%"}
                                        minH={["22.22vw", "7vw"]}
                                        fontSize={["2.78vw", "1.2vw"]}
                                        borderRadius={["2.7vw", "0.7vw"]}
                                        border={"2px"}
                                        borderColor={"primary_3"}
                                        value={bio}
                                        onChange={handleInputChange}
                                        maxLength={charLimit}
                                        placeholder='Write here'
                                        className='no-scrollbar'
                                    />
                                    <Text
                                        fontSize={["2.7vw", "0.9vw"]}
                                        color="gray.500"
                                        position="absolute"
                                        bottom={["1vw", "0.3vw"]}
                                        right={["3vw", "0.5vw"]}
                                        fontFamily={"raleway"}
                                    >
                                        {charCount}/{charLimit}
                                    </Text>
                                </Box>
                            </FormControl>

                            {/* The Flex takes remaining space and ensures the buttons stay at the bottom */}
                            <Flex display={{ base: "none", sm: "flex" }} mt="5%" flex="1" justifyContent="flex-end" flexDirection="column" >
                                <Flex gap={"1.4vw"}>
                                    <Button onClick={handleSubmit} isDisabled={!firstName || !lastName || !country} fontSize={"1.4vw"} px={"3.75vw"} h={"3.61vw"} borderRadius={"2.78vw"} border={"2px"} fontFamily={"raleway"} color={"white"} variant={"none"} bg={"primary_3"} borderColor={"primary_3"} >Submit</Button>
                                </Flex>
                            </Flex>
                        </Box >

                        {/* Mobile */}
                        < Flex display={{ base: "flex", sm: "none" }} flexDirection={"column"} gap={"5vw"} >
                            <Flex w={"100%"} gap={"3.9vw"}>
                                <Button isDisabled={!firstName || !lastName || !country} fontSize={"3.33vw"} w={"50%"} h={"7.22vw"} borderRadius={"4.167vw"} border={"2px"} fontFamily={"raleway"} color={"primary_3"} borderColor={"primary_3"} variant={"none"} _hover={{ bg: "primary_3", color: "white" }} onClick={handleSubmit} >Submit</Button>
                            </Flex>
                        </Flex >

                    </Flex >
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ProfileFormPopup;