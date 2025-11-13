import { Box, Button, Flex, Heading, Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropModal = ({ aspectRatio = 4 / 5, file, isOpen, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ unit: '%', aspect: aspectRatio });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [imgSrc, setImgSrc] = useState('');
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);

    // Create image source when file changes
    useEffect(() => {
        const loadImage = async () => {
            if (!file) return;

            try {
                let imageUrl = '';
                if (file.isUrl && file.url) {
                    // Fetch the image and convert to blob
                    const response = await fetch(file.url);
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

    const onImageLoaded = (img) => {
        imgRef.current = img;

        // Set initial crop to center of image
        const { width, height } = img;
        const cropSize = Math.min(width, height) * 0.8;

        setCrop({
            unit: 'px',
            width: cropSize,
            height: cropSize * (1 / (aspectRatio)), // 4:3 aspect ratio
            x: (width - cropSize) / 2,
            y: (height - (cropSize * (1 / (aspectRatio)))) / 2,
            aspect: aspectRatio
        });
    };

    const drawCroppedImage = (crop) => {
        if (
            !crop ||
            !crop.width ||
            !crop.height ||
            !previewCanvasRef.current ||
            !imgRef.current
        ) return;

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext("2d");

        // Calculate the scale between displayed image and natural image
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Use the natural (full resolution) dimensions for the canvas
        const outputWidth = crop.width * scaleX;
        const outputHeight = crop.height * scaleY;

        // Set canvas to actual crop size in natural resolution
        canvas.width = outputWidth;
        canvas.height = outputHeight;

        // Scale the canvas display size for preview (keep it reasonable)
        const maxPreviewSize = 300;
        const aspectRatio = outputWidth / outputHeight;
        let displayWidth, displayHeight;

        if (outputWidth > outputHeight) {
            displayWidth = Math.min(maxPreviewSize, outputWidth);
            displayHeight = displayWidth / aspectRatio;
        } else {
            displayHeight = Math.min(maxPreviewSize, outputHeight);
            displayWidth = displayHeight * aspectRatio;
        }

        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';

        // Set high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw the cropped image at full resolution
        ctx.drawImage(
            image,
            crop.x * scaleX, // source x
            crop.y * scaleY, // source y
            crop.width * scaleX, // source width
            crop.height * scaleY, // source height
            0, // destination x
            0, // destination y
            outputWidth, // destination width (full resolution)
            outputHeight // destination height (full resolution)
        );
    };

    useEffect(() => {
        if (completedCrop) {
            drawCroppedImage(completedCrop);
        }
    }, [completedCrop]);

    const handleCrop = () => {
        if (!completedCrop || !previewCanvasRef.current) {
            console.error('No crop area selected or canvas not ready');
            return;
        }

        const canvas = previewCanvasRef.current;

        // Determine the best quality and format
        const mimeType = file.type || 'image/jpeg';
        let quality = 1.0; // Maximum quality

        // For JPEG, use high quality but not maximum to avoid huge files
        if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
            quality = 0.95;
        }

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    console.error('Failed to create blob from canvas');
                    return;
                }

                const croppedFile = new File([blob], file.name, {
                    type: mimeType,
                    lastModified: Date.now()
                });

                // console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
                // console.log('Cropped file size:', (croppedFile.size / 1024 / 1024).toFixed(2), 'MB');
                // console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

                onCropComplete(croppedFile);
                onClose();
            },
            mimeType,
            quality
        );
    };

    const handleClose = () => {
        // Reset state when closing
        setCrop({ unit: '%', aspect: aspectRatio });
        setCompletedCrop(null);
        setImgSrc('');
        onClose();
    };

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const canvas = previewCanvasRef.current;
        const image = imgRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const pixelRatio = window.devicePixelRatio;

        // Set canvas width/height to match cropped area
        canvas.width = crop.width * scaleX * pixelRatio;
        canvas.height = crop.height * scaleY * pixelRatio;

        const ctx = canvas.getContext('2d');
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

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
    }, [completedCrop]);


    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <ModalOverlay />
            <ModalContent maxW={["90vw", "50vw"]} maxH="90vh" borderRadius={"3xl"}>
                <ModalBody m={[2, 4]} overflow="auto">
                    {imgSrc && (
                        <Box mb={'1rem'} >
                            <ReactCrop
                                src={imgSrc}
                                crop={crop}
                                onChange={(newCrop) => setCrop(newCrop)}
                                onComplete={(newCrop) => setCompletedCrop(newCrop)}
                                onImageLoaded={onImageLoaded}
                                aspect={aspectRatio}
                                minWidth={50}
                                minHeight={37.5}
                                style={{ maxWidth: '100%' }}
                            />
                        </Box>
                    )}

                    {completedCrop && (
                        <Box mb="1rem" textAlign="center">
                            <Heading
                                as="h4"
                                mb="0.5rem"
                                fontSize="14px"
                                fontWeight="bold"
                            >
                                Preview (High Quality):
                            </Heading>
                            <Box
                                as="canvas"
                                mx={"auto"}
                                ref={previewCanvasRef}
                                border="1px solid #ccc"
                                borderRadius="8px"
                                w={"fit-content!important"}
                                maxW="100%"
                                sx={{
                                    imageRendering: 'high-quality',
                                }}
                            />
                        </Box>
                    )}

                    <Flex gap={2} justifyContent="flex-end">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleCrop}
                            isDisabled={!completedCrop}
                        >
                            Crop & Upload
                        </Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ImageCropModal;