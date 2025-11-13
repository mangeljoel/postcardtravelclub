import React, { useContext, useRef } from 'react';
import { Flex, Text, useToast } from '@chakra-ui/react';
import { UploadImageIcon } from '../../styles/ChakraUI/icons';
import { getUrlOfUploadImage } from '../../services/utilities';
import AppContext from '../AppContext';
import { getExpertbyUserLink, updateDBValue } from '../../queries/strapiQueries';

const UploadImage = ({ }) => {
    const { profile, updateUser } = useContext(AppContext)
    const inputFileRef = useRef(null);

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
        <Flex
            w={"100%"}
            h={["100%"]}
            borderRadius={["4.167vw", "2.083vw"]}
            bg={"#D9D9D9"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            onClick={() => inputFileRef.current.click()} // Open file input on click
            cursor={"pointer"}
        >
            <UploadImageIcon w={["8.88vw", "4.3vw"]} h={["11.11vw", "5vw"]} fill={"#D9D9D9"} />
            <Text fontSize={["2.5vw", "1vw"]} mt={"2.08vw"} fontWeight={600} fontFamily={"raleway"} color={"primary_3"}>
                {`Select a cover image`}
            </Text>

            {/* Hidden input for image upload */}
            <input
                type="file"
                ref={inputFileRef}
                style={{ display: "none" }}
                accept="image/*" // Accept only image files
                onChange={handleFileChange}
            />
        </Flex>
    );
};

export default UploadImage;
