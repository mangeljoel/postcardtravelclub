import { Box, Button, Flex, Input, Modal, ModalBody, ModalContent, ModalOverlay, useToast } from '@chakra-ui/react';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { MdOutlineRotateLeft, MdOutlineRotateRight } from "react-icons/md";
import { Textarea } from '@chakra-ui/react';

// import { getCroppedImg } from './utils/cropImage'; // utility to extract canvas blob

const StaticImageCropModal = ({ file, isOpen, onClose, onCropComplete, aspectRatio = 4 / 3, note, setNote }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imgSrc, setImgSrc] = useState('');
    // const [note, setNote] = useState('');
    const toast = useToast()

    useEffect(() => {
        const loadImage = async () => {
            if (!file) return;

            try {
                let imageUrl = '';
                if (file.isUrl && file.url) {
                    // console.log(file)
                    // Fetch the image and convert to blob
                    // const response = await fetch(file.url);
                    const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(file.url)}`);
                    const blob = await response.blob();
                    const fetchedFile = new File([blob], "cropped-image.jpg", {
                        type: blob.type,
                        lastModified: Date.now(),
                    });
                    setImgSrc(URL.createObjectURL(fetchedFile));
                } else if (file instanceof File) {
                    imageUrl = URL.createObjectURL(file);
                    setImgSrc(imageUrl);
                }

                return () => {
                    if (imageUrl) URL.revokeObjectURL(imageUrl);
                };
            } catch (err) {
                console.error("Error loading image:", err);
            }
        };

        loadImage();
    }, [file]);

    const onCropCompleteInternal = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleDone = async () => {
        try {
            // if (!note?.trim()) {
            //     toast({
            //         title: "Please add a note with the image.",
            //         status: "warning",
            //         isClosable: true,
            //         position: 'top',
            //         variant: "subtle"
            //     });
            //     return
            // }
            const croppedBlob = await getCroppedImg(imgSrc, croppedAreaPixels, file.name, rotation);
            const croppedFile = new File([croppedBlob], file.name, { type: file.type });

            onCropComplete(croppedFile, note || ""); // 👈 include note here
            onClose();
        } catch (e) {
            console.error('Crop failed', e);
        }
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous'); // Needed for CORS
            image.src = url;
        });

    const getRadianAngle = (degreeValue) => (degreeValue * Math.PI) / 180;

    function rotateSize(width, height, rotation) {
        const rotRad = getRadianAngle(rotation);
        return {
            width:
                Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
            height:
                Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
        };
    }

    async function getCroppedImg(imageSrc, crop, fileName, rotation = 0) {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const rotRad = getRadianAngle(rotation);

        // calculate bounding box of rotated image
        const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
            image.width,
            image.height,
            rotation
        );

        // set canvas to match bounding box
        canvas.width = bBoxWidth;
        canvas.height = bBoxHeight;

        // move to center and rotate
        ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
        ctx.rotate(rotRad);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);

        const data = ctx.getImageData(crop.x, crop.y, crop.width, crop.height);

        // set canvas to cropped size
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = crop.width;
        croppedCanvas.height = crop.height;
        const croppedCtx = croppedCanvas.getContext('2d');

        // paste the cropped image data
        croppedCtx.putImageData(data, 0, 0);

        return new Promise((resolve) => {
            croppedCanvas.toBlob((file) => {
                file.name = fileName;
                resolve(file);
            }, 'image/jpeg');
        });
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose} size={["sm", "lg"]}>
            <ModalOverlay />
            <ModalContent>
                <ModalBody>
                    <Box position="relative" width={"100%"} height="400px" mb={[4]}>
                        <Cropper
                            image={imgSrc}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropCompleteInternal}
                            style={{
                                cropAreaStyle: {
                                    border: '2px dashed rgba(255, 255, 255, 0.8)', // Subtle crop indicator
                                    borderRadius: '4px',
                                }
                            }}
                        />
                    </Box>
                    {/* <div style={{
                        width: '100%',
                        height: '400px',
                        position: 'relative',
                        overflow: 'hidden', // Hide anything outside boundaries
                        border: '2px solid #ddd', // Optional: visual boundary
                        borderRadius: '8px' // Optional: rounded corners
                    }}>
                        <Cropper
                            image={imgSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropCompleteInternal}
                            // Hide all UI elements
                            // showGrid={false}
                            // zoomWithScroll={false}
                            // cropShape="rect"
                            // restrictPosition={true} // Restrict crop area to image boundaries
                            style={{
                                containerStyle: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    background: '#f5f5f5', // Optional background color
                                    // visibility: 'hidden'
                                },
                                cropAreaStyle: {
                                    border: '2px dashed rgba(255, 255, 255, 0.8)', // Subtle crop indicator
                                    borderRadius: '4px',
                                    visibility: "visible",
                                    overflow: "hidden"
                                }
                            }}
                        />
                    </div> */}
                    <Flex align="center" gap={2} my={2} justify={"center"}>
                        <Button size="sm" onClick={() => setRotation((prev) => (prev - 90) % 360)}>
                            <MdOutlineRotateLeft />
                        </Button>
                        <Button size="sm" onClick={() => setRotation((prev) => (prev + 90) % 360)}>
                            <MdOutlineRotateRight />
                        </Button>
                    </Flex>


                    <Textarea
                        border="1px"
                        borderColor="black"
                        placeholder="Write a note..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                        resize="vertical"
                    />

                    <Flex flexDirection={["column", "row"]} mt={4} gap={2} justify="space-between">
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(e.target.value)}
                        />
                        <Flex gap={[2]}>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button colorScheme="blue" onClick={handleDone}>Crop & Upload</Button>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default StaticImageCropModal;
