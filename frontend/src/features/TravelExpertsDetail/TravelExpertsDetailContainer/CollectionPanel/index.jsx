import { useContext, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import AppContext from "../../../AppContext";
import NewStoryList from "../../../TravelGuide/NewStoryList";
import ImageUpload from "../../../ImageUpload";
import { uploadfile, getFounderStory } from "../../../../services/utilities";
import { updateDBValue } from "../../../../queries/strapiQueries";

const CollectionPanel = ({
    stories,
    isStoriesLoading,
    pageProfile,
    isTabletOrMobile,
    refetch
}) => {
    const { profile, isActiveProfile } = useContext(AppContext);
    const [uploadImage, setUploadImage] = useState({
        show: false,
        type: {},
        multiple: false,
        callbackType: "pageCover",
        cropImage: true
    });

    const createPage = async (key, croppedImage) => {
        if (key === "pageCover") {
            let data = {
                user: profile?.id
            };
            uploadfile(
                croppedImage,
                null,
                "albums",
                "coverImage",
                data,
                async resp => {
                    if (resp?.data?.id && profile) {
                        let hasFounderStory = await getFounderStory(profile.id);
                        if (hasFounderStory && hasFounderStory.length > 0) {
                            let data = {
                                postcards: hasFounderStory[0].id
                            };
                            updateDBValue("albums", resp.data.id, data);
                        }
                    }
                    setUploadImage(false);
                    refetch();
                }
            );
        }
    };
    return (
        <Box w="100%">
            {!isStoriesLoading && stories?.length > 0 ? (
                <NewStoryList
                    stories={stories || []}
                    isMobile={isTabletOrMobile}
                    isStoriesLoading={isStoriesLoading}
                    refetch={refetch}
                />
            ) : (
                isActiveProfile(pageProfile) && (
                    <Button
                        my="3em"
                        p="2em"
                        lineHeight="1.5em"
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
                    >
                        {" "}
                        Upload a Cover Image to
                        <br /> Create your Postcard Page
                    </Button>
                )
            )}

            {uploadImage.show && (
                <ImageUpload
                    openFile={uploadImage.show}
                    cropImage={uploadImage.cropImage}
                    cropType={uploadImage.type}
                    multiple={uploadImage.multiple}
                    callbackType={uploadImage.callbackType}
                    resetUpload={() => setUploadImage(false)}
                    callBackOnUpload={(callbackType, croppedImage) =>
                        createPage(callbackType, croppedImage)
                    }
                />
            )}
        </Box>
    );
};

export default CollectionPanel;
