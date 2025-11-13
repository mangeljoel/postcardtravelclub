import { Box, IconButton } from '@chakra-ui/react'
import React, { useContext, useRef } from 'react'
import { ChakraNextImage } from '../../patterns/ChakraNextImage'
import UploadImage from './UploadImage'
import { EditIcon } from '@chakra-ui/icons'
import { getUrlOfUploadImage } from '../../services/utilities'
import { getExpertbyUserLink, updateDBValue } from '../../queries/strapiQueries'
import AppContext from '../AppContext'

const UploadCoverImage = ({ coverImage, isOwner }) => {
    const { profile, updateUser } = useContext(AppContext)
    const inputFileRef = useRef(null);

    const handleEditClick = () => {
        inputFileRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        // console.log(file)

        try {
            await getUrlOfUploadImage(file, (result) => {
                if (result?.id && result?.url) {
                    updateDBValue('users', profile?.id, { coverImage: result.id }).then(async (response) => {
                        const user = await getExpertbyUserLink(profile.slug)
                        await updateUser(Array.isArray(user) ? user[0] : user)
                    })
                }
            });
        } catch (err) {
            // console.log(err); // Ensure to log the error correctly
        }
    };

    return (
        <Box w={"100%"} h={"100%"} borderRadius={["4.167vw", "2.083vw"]} >
            {coverImage ?
                <Box w={"100%"} h={"100%"} position={"relative"}>
                    <ChakraNextImage borderRadius={["4.167vw", "2.083vw"]} src={coverImage.url} objectFit={"cover"} alt={"user profile pic"} />
                    {isOwner && (
                        <IconButton
                            variant={"none"}
                            color={"#EFE9E4"}
                            icon={<EditIcon w={["60%", "80%"]} h={["60%", "80%"]} />}
                            position="absolute"
                            top="12px"
                            right="12px"
                            onClick={() => handleEditClick()} // Handle edit click
                            aria-label="Edit Image"
                        />
                    )}
                    <input
                        type="file"
                        ref={inputFileRef}
                        style={{ display: "none" }}
                        multiple={false}
                        accept="image/*" // Accept only image files
                        onChange={handleFileChange}
                    />
                </Box>
                :
                isOwner ? <UploadImage /> : <></>
            }
        </Box>
    )
}

export default UploadCoverImage