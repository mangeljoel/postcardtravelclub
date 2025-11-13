import { useState, useEffect, createRef, useCallback } from "react";
import { Box } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import ImageCrop from "../ImageCrop";
import { useRef } from "react";
const ImageUpload = ({
    multiple,
    openFile,
    cropType,
    callbackType,
    cropImage,
    callBackOnUpload,
    resetUpload
}) => {
    const [uploadImg, setUpImg] = useState();
    const dropzoneRef = useRef();
    const [showCrop, setShowCrop] = useState(false);
    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop: (acceptedFile) => {
            if (cropImage) {
                setUpImg(acceptedFile[0]);
                setShowCrop(true);
            } else callBackOnUpload(callbackType, acceptedFile[0]);
        },
        onError: () => resetUpload(),
        onFileDialogCancel: () => resetUpload(),
        multiple: multiple ? multiple : false
    });

    useEffect(() => {
        open();
    }, [openFile]);
    return (
        <>
            {" "}
            <Box {...getRootProps()}>
                <input {...getInputProps()} />
            </Box>
            {showCrop && (
                <ImageCrop
                    selectedImage={uploadImg}
                    cropType={cropType}
                    locked={false}
                    resetCrop={() => {
                        setShowCrop(false);
                        resetUpload();
                    }}
                    callUploadFile={(croppedFile) =>
                        callBackOnUpload(callbackType, croppedFile)
                    }
                />
            )}
        </>
    );
};
export default ImageUpload;
