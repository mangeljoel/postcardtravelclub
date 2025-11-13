import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    Flex,
    Input,
    Text,
    FormControl,
    FormLabel,
    Select,
    Textarea,
    useToast
} from '@chakra-ui/react';
import { CloseIcon } from '../../styles/ChakraUI/icons';
import { ChakraNextImage } from '../../patterns/ChakraNextImage';
import { getUrlOfUploadImage } from '../../services/utilities';
import { fetchPaginatedResults, getCountries, getExpertbyUserLink, updateDBValue } from '../../queries/strapiQueries';
import AppContext from '../AppContext';
import { useCountries } from '../../hooks/useCountriesHook';

const EditProfileMobilePopup = ({ userData, isOpen, openModal, closeModal }) => {
    const { updateUser } = useContext(AppContext)
    const countries = useCountries('all')
    const [profilePic, setProfilePic] = useState(userData?.profilePic?.url || userData?.profilePicURL)
    const [profilePicId, setProfilePicId] = useState(userData?.profilePic?.id)
    const [firstName, setFirstName] = useState(userData?.firstName || '');
    const [lastName, setLastName] = useState(userData?.lastName || '');
    const [country, setCountry] = useState(userData?.country?.id || null);
    const [blogUrl, setBlogUrl] = useState(userData?.social?.blogURL || '')
    const [bio, setBio] = useState(userData?.bio || '')

    const [charCount, setCharCount] = useState(0);
    const [isUrlValid, setIsUrlValid] = useState(true);

    const toast = useToast()
    const inputFileRef = useRef(null)
    const charLimit = 150;

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
                social: { blogURL: blogUrl },
                bio,
                profilePic: profilePicId,
            }
            updateDBValue('users', userData.id, payload).then(async (response) => {
                const user = await getExpertbyUserLink(userData.slug)
                await updateUser(Array.isArray(user) ? user[0] : user)
            })
            closeModal()
        } catch (err) {
            // console.log(err)
        }
    }

    return (
        <>
            {/* Modal Popup */}
            <Modal w={"100%"} isOpen={isOpen} onClose={closeModal} size={"xl"} >
                <ModalOverlay />
                <ModalContent w={"90vw"} borderRadius={"4.167vw"} display={{ base: "block", sm: "none" }} >
                    <ModalHeader fontSize={"4.167vw"} color={"primary_3"} fontFamily={"raleway"}>Edit Profile</ModalHeader>
                    <ModalBody pb={"10vw"}>
                        <Box
                            onClick={closeModal}
                            position={"absolute"}
                            top={"2%"}
                            right={"4%"}
                            width={["7.72vw", "50px", "60px"]}
                            _hover={{
                                svg: {
                                    fill: "#307FE2", // Apply the hover effect for the icon's fill
                                },
                                "svg .outer-rect, svg path": {
                                    stroke: "#EFE9E4", // Apply the hover effect for stroke
                                },
                            }}
                        >
                            <CloseIcon stroke={"#307FE2"} width={"100%"} height={"100%"} />
                        </Box>


                        {/* Content for editing profile goes here */}
                        <Flex flexDirection={"column"}>
                            <Box mx={"auto"}>
                                <ChakraNextImage w={["29vw", "12.64vw"]} h={["29vw", "12.64vw"]} borderRadius={"100%"} src={profilePic ? profilePic : "/assets/default-profile-pic.png"} objectFit={"cover"} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt={"profile pic"} />
                                <>
                                    <Text
                                        fontSize={"2.78vw"}
                                        mt={"1.4vw"}
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

                            <Flex justifyContent={"space-between"} mt={"3vw"}>
                                <FormControl isRequired isInvalid={!firstName}>
                                    <FormLabel mb={1} fontSize={"2.78vw"} color={"primary_3"} fontFamily={"raleway"}
                                        sx={{
                                            "& .chakra-form__required-indicator": {
                                                fontSize: "1.5em", // Adjust the size
                                                color: "red",      // Change the color
                                                fontWeight: "bold",
                                            },
                                        }}>
                                        First Name
                                    </FormLabel>
                                    <Input type='text' fontSize={"3vw"} fontWeight={600} w={"31.67vw"} h={"8.88vw"} borderRadius={"2.7vw"} border={"2px"} borderColor={"primary_3"} color={"primary_3"}
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl isRequired isInvalid={!lastName}>
                                    <FormLabel mb={1} fontSize={"2.78vw"} color={"primary_3"} fontFamily={"raleway"}
                                        sx={{
                                            "& .chakra-form__required-indicator": {
                                                fontSize: "1.5em", // Adjust the size
                                                color: "red",      // Change the color
                                                fontWeight: "bold",
                                            },
                                        }}>
                                        Last Name
                                    </FormLabel>
                                    <Input type='text' fontSize={"3vw"} fontWeight={600} w={"31.67vw"} h={"8.88vw"} borderRadius={"2.7vw"} border={"2px"} borderColor={"primary_3"} color={"primary_3"}
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </FormControl>
                            </Flex>

                            {/* <FormControl mt={"3vw"} isInvalid={!isUrlValid}>
                                <FormLabel mb={1} fontSize={"2.78vw"} color={"primary_3"} fontFamily={"raleway"}>Custom Link</FormLabel>
                                <Input type='text' fontSize={"3vw"} fontWeight={600} w={"100%"} h={"8.88vw"} borderRadius={"2.7vw"} border={"2px"} borderColor={"primary_3"} color={"primary_3"}

                                    value={blogUrl}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const isValid = validateUrl(value);
                                        setBlogUrl(value)
                                        setIsUrlValid(isValid);
                                    }}
                                />
                                {!isUrlValid && (
                                    <FormErrorMessage fontSize={"3vw"}>Please enter a valid URL.</FormErrorMessage>
                                )}
                            </FormControl> */}

                            <FormControl mt={"3vw"} isRequired isInvalid={!country}>
                                <FormLabel mb={1} fontSize={"2.78vw"} color={"primary_3"} fontFamily={"raleway"}
                                    sx={{
                                        "& .chakra-form__required-indicator": {
                                            fontSize: "1.5em", // Adjust the size
                                            color: "red",      // Change the color
                                            fontWeight: "bold",
                                        },
                                    }}>
                                    Country
                                </FormLabel>
                                <Select fontSize={"3vw"} w={"50vw"} h={"8.88vw"} borderRadius={"2.7vw"} border={"2px"} borderColor={"primary_3"} color={"#9C9895"} placeholder='Select country'
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

                            <FormControl mt={"3vw"} >
                                <FormLabel
                                    mb={1}
                                    fontSize={"2.7vw"}
                                    color={"primary_3"}
                                    fontFamily={"raleway"}
                                >
                                    Bio
                                </FormLabel>
                                <Box position="relative" >
                                    <Textarea
                                        w={"100%"}
                                        minH={"22.22vw"}
                                        fontSize={"2.78vw"}
                                        borderRadius={"2.7vw"}
                                        border={"2px"}
                                        borderColor={"primary_3"}
                                        value={bio}
                                        onChange={handleInputChange}
                                        maxLength={charLimit}
                                        placeholder='Write here'
                                        className='no-scrollbar'
                                    />
                                    <Text
                                        fontSize={"2.7vw"}
                                        color="gray.500"
                                        position="absolute"
                                        bottom="1vw"
                                        right="3vw"
                                        fontFamily={"raleway"}
                                    >
                                        {charCount}/{charLimit}
                                    </Text>
                                </Box>
                            </FormControl>

                            <Button mx="auto" mt={"7.5vw"} w={"35.83vw"} onClick={handleSubmit} isDisabled={!firstName || !lastName || !country} fontSize={"3.89vw"} px={"11.11vw"} h={"9.2vw"} borderRadius={"6.25vw"} fontFamily={"raleway"} color={"white"} variant={"none"} bg={"primary_3"}>Submit</Button>

                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default EditProfileMobilePopup;
