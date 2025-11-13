import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { Button, Box, InputGroup } from "@chakra-ui/react";

import PostcardModal from "../PostcardModal";

const ImageCrop = ({
    selectedImage,
    cropType,
    callUploadFile,
    resetCrop,
    preview,
    locked
}) => {
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState(cropType);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [croppedFile, setCroppedFile] = useState(null);
    const [cropInProgess, setCropInProgress] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const open = () => setIsOpen(!isOpen);
    const close = () => setIsOpen(false);

    const onLoad = useCallback(img => {
        // console.log("onload", img);
        imgRef.current = img;
    }, []);
    const getCroppedImg = async (image, crop, fileName) => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const ctx = canvas.getContext("2d");
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );
        const base64Image = canvas.toDataURL("image/jpeg");
        if (preview) preview(base64Image);
        canvas.toBlob(
            blob => {
                blob.name = fileName;
                callUploadFile(blob);
            },
            "image/jpeg",
            1
        );
        setCropInProgress(false);
    };
    useEffect(() => {
        if (selectedImage) {
            const reader = new FileReader();
            reader.addEventListener("load", () => setUpImg(reader.result));
            reader.readAsDataURL(selectedImage);
        }
    }, [selectedImage]);

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext("2d");
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );

        const base64Image = canvas.toDataURL("image/jpeg");
        if (preview) preview(base64Image); //console.log(base64Image);
    }, [completedCrop]);

    return (
        <PostcardModal
            isShow={isOpen}
            headerText="Crop Image"
            size="3xl"
            scrollBehavior={"inside"}
            children={
                <Box className="App" pos="relative">
                    <Box
                        textAlign="center"
                        pos="sticky"
                        bg="background"
                        p={2}
                        zIndex={999}
                        top={"-10px"}
                    >
                        <Button
                            disabled={cropInProgess}
                            onClick={e => {
                                setCropInProgress(true);
                                e.stopPropagation();
                                getCroppedImg(
                                    imgRef.current,
                                    completedCrop,
                                    "croppedImage"
                                );
                                close();
                            }}
                        >
                            Crop
                        </Button>
                    </Box>
                    <ReactCrop
                        src={upImg}
                        onImageLoaded={onLoad}
                        crop={crop}
                        locked={locked}
                        onChange={c => {
                            setCrop(c);
                        }}
                        onComplete={c => {
                            setCompletedCrop(c);
                        }}
                    />
                    {/* <Box textAlign="center">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                getCroppedImg(
                                    imgRef.current,
                                    completedCrop,
                                    "croppedImage"
                                );
                                close();
                            }}
                        >
                            Crop
                        </Button>
                    </Box> */}
                </Box>
            }
            handleClose={() => {
                resetCrop();
                close();
            }}
        />
    );
};

export default ImageCrop;
