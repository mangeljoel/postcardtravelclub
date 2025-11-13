import { Box, Avatar, Button, Image, SkeletonCircle } from "@chakra-ui/react";
import { useState } from "react";
import ImageUpload from "../ImageUpload";
import { ApiUpload } from "../../services/utilities";
import { getExpertbyId } from "../../queries/strapiQueries";
const ProfileFotoEdit = ({ editData, onChange }) => {
    const [uploadImage, setUploadImage] = useState({
        show: false,
        type: {},
        multiple: false,
        callbackType: "profilePic",
        cropImage: false
    });
    const [loading, setLoading] = useState(false);
    const updateProfilePic = async (key, croppedImage) => {
        if (key === "profilePic") {
            ApiUpload(
                croppedImage,
                editData?.id,

                "plugin::users-permissions.user",

                "profilePic",
                async (result) => {
                    if (result) {
                        setUploadImage(false);
                        let data = await getExpertbyId(editData.id);
                        if (data[0]) onChange();
                        setLoading(false);
                    }
                }
            );
        }
    };
    return (
        <Box mx="auto" textAlign={"center"}>
            {loading ? (
                <SkeletonCircle size="90px" mx="auto" />
            ) : (
                <Image
                    src={
                        editData?.profilePic
                            ? editData?.profilePic.url
                            : "/assets/images/p_stamp.png"
                    }
                    width="120px"
                    objectFit={"cover"}
                    height="120px"
                    borderRadius={"full"}
                    mx="auto"
                    alt={"profile"}
                />
            )}
            <br />
            <Button
                mx="2em"
                my="1em"
                size="sm"
                //alignItems={"baseline"}
                //my="auto"
                onClick={() =>
                    setUploadImage({
                        show: true,
                        type: {
                            unit: "%",
                            width: 100,
                            height: "400px",
                            aspect: 1
                        },
                        multiple: false,
                        callbackType: "profilePic",
                        cropImage: false
                    })
                }
            >
                Change
            </Button>

            {uploadImage.show && (
                <ImageUpload
                    openFile={uploadImage.show}
                    cropImage={uploadImage.cropImage}
                    cropType={uploadImage.type}
                    multiple={uploadImage.multiple}
                    callbackType={uploadImage.callbackType}
                    resetUpload={() => setUploadImage(false)}
                    callBackOnUpload={(callbackType, croppedImage) => {
                        setLoading(true);
                        updateProfilePic(callbackType, croppedImage);
                    }}
                />
            )}
        </Box>
    );
};
export default ProfileFotoEdit;
