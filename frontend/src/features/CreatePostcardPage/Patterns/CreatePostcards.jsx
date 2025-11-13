import { Box } from "@chakra-ui/react";
import { useState, useEffect, useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import AppContext from "../../AppContext";
import { uploadfile } from "../../../services/utilities";
import FloatingAddButton from "../../../patterns/AddButton";

const CreatePostcards = (props) => {
    const { album, refetchNewsArticle } = props;
    const { profile } = useContext(AppContext);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [isCoverImage, setIsCoverImage] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState();
    const [uploadCounter, setUploadCounter] = useState(0);

    const onDrop = useCallback((acceptedFiles) => {
        setIsCoverImage(false);
        setUploadingImages(true);
        setUploadCounter(-1);
        setFilesToUpload(acceptedFiles);
    }, []);

    useEffect(() => {
        if (filesToUpload && uploadCounter < 0) {
            setFilesToUpload(null);
            let data = {
                user: profile.id,
                album: album.id
            };
            let count = 0;
            setUploadCounter(count);
            filesToUpload.forEach((file) => {
                uploadfile(
                    file,
                    null,
                    "postcards",
                    "coverImage",
                    data,
                    async () => {
                        count++;
                        setUploadCounter(count);
                        await refetchNewsArticle();
                        const element = document.getElementById("Postcard Experiences");
                        if (element) {
                            element.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });
                        }
                    }
                );
            });
        }
    }, [filesToUpload]);

    const {
        getRootProps: getCreatePostcardRootProps,
        getInputProps: getCreatePostcardInputProps
    } = useDropzone({
        onDrop,
        multiple: false
    });

    return (
        <Box {...getCreatePostcardRootProps()}>
            <input {...getCreatePostcardInputProps()} />

            <FloatingAddButton
                onClick={() => {
                    // trigger input click manually
                    document.querySelector('input[type="file"]').click();
                }}
                type="memory"
                isVisible={true}
            />
        </Box>
    );
};

export default CreatePostcards;
