import { useState, useEffect } from "react";
import { Box, AspectRatio, Image, Icon } from "@chakra-ui/react";
import PageEditForm from "./PageEditForm";
import { useContext } from "react";
import AppContext from "../../../AppContext";
import { AiFillCamera } from "react-icons/ai";
import ImageUpload from "../../../ImageUpload";
import {
    getFounderStory,
    slugify,
    uploadfile
} from "../../../../services/utilities";
const DraftStoryCard = ({ page, refetch }) => {
    const { profile, isActiveProfile } = useContext(AppContext);
    const [story, setStory] = useState([]);
    const [uploadImage, setUploadImage] = useState({
        show: false,
        type: {},
        multiple: false,
        callbackType: "pageCover",
        cropImage: true
    });
    useEffect(() => {
        if (page) setStory(page);
    }, [page]);
    const createPage = async (key, croppedImage) => {
        if (key === "pageCover") {
            let data = {};
            if (!story?.slug && story?.name)
                data = { slug: slugify(story.name) };
            uploadfile(
                croppedImage,
                story?.id,
                "albums",
                "coverImage",
                data,
                async resp => {
                    refetch();
                    setUploadImage(false);
                }
            );
        }
    };
    return (
        <Box
            w="100%"
            boxShadow="0px 2px 6px rgba(0, 0, 0, 0.16)"
            borderTopRadius="8px"
        >
            <AspectRatio
                borderTopRadius="8px"
                ratio={1}
                overflow="hidden"
                pos="relative"
            >
                <Box pos="relative">
                    <Image
                        src={story?.coverImage?.url || global.$defaultProfile}
                        objectFit="cover"
                        layout="fill"
                        alt={"cover"}
                    ></Image>
                    {isActiveProfile(profile) && (
                        <Icon
                            as={AiFillCamera}
                            color="primary_1"
                            background="white"
                            padding="2px"
                            borderRadius="full"
                            boxSize="25px"
                            pos="absolute"
                            top="10px"
                            right="5px"
                            my="auto"
                            onClick={e =>
                                setUploadImage({
                                    show: true,
                                    type: {
                                        unit: "%",
                                        width: 100,
                                        height: "400px",
                                        aspect: 1
                                    },
                                    multiple: false,
                                    callbackType: "pageCover",
                                    cropImage: true
                                })
                            }
                        />
                    )}
                </Box>
            </AspectRatio>
            {uploadImage.show && (
                <ImageUpload
                    openFile={uploadImage.show}
                    cropImage={uploadImage.cropImage}
                    cropType={uploadImage.type}
                    multiple={uploadImage.multiple}
                    callbackType={uploadImage.callbackType} // this is important to reset the state
                    resetUpload={() => setUploadImage(false)} // this is important to reset the state
                    callBackOnUpload={(callbackType, croppedImage) =>
                        createPage(callbackType, croppedImage)
                    }
                />
            )}
            <Box bg="cardBackground" borderBottomRadius="8px" p="3%">
                <PageEditForm page={story} refetch={refetch} />
            </Box>
        </Box>
    );
};
export default DraftStoryCard;
