import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import {
    Box, Button, FormControl, FormLabel, Input, Textarea, useToast, Switch,
    List, ListItem, Image, SimpleGrid, IconButton, Flex, VStack, Text,
    AspectRatio, HStack
} from '@chakra-ui/react';
import { fetchPaginatedResults, updateDBValue, createDBEntry } from '../../queries/strapiQueries';
import PostcardModal from '../PostcardModal';
import { getUrlOfUploadImage, slugify } from '../../services/utilities';
import AppContext from '../AppContext';
import Cropper from 'react-easy-crop';
import { MdOutlineRotateLeft, MdOutlineRotateRight, MdEdit, MdDelete, MdClose, MdCheck, MdAdd } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_FORM_VALUES = {
    name: '',
    date: null,
    intro: '',
    region: '',
    country: '',
    gallery: [],
    signature: '',
    externalUrl: '',
    shareType: 'private',
};

// Helper function to upload images consistently
const uploadImageToServer = (file) => {
    return new Promise((resolve, reject) => {
        getUrlOfUploadImage(
            file,
            (uploadedImage) => {
                resolve(uploadedImage);
            },
            '', // note/caption
            (percent) => {
                console.log(`Upload progress: ${percent}%`);
            },
            (error) => {
                reject(error);
            }
        );
    });
};

const getCroppedImg = (imageSrc, croppedAreaPixels, rotation = 0, fileName = 'cropped.jpeg') => {
    return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.crossOrigin = 'anonymous';
        image.src = imageSrc;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const radians = (rotation * Math.PI) / 180;

            // Use natural dimensions
            const { naturalWidth, naturalHeight } = image;

            // Calculate rotated image dimensions
            const sin = Math.abs(Math.sin(radians));
            const cos = Math.abs(Math.cos(radians));

            const rotatedWidth = naturalWidth * cos + naturalHeight * sin;
            const rotatedHeight = naturalWidth * sin + naturalHeight * cos;

            // Create temp canvas for rotation
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            tempCanvas.width = rotatedWidth;
            tempCanvas.height = rotatedHeight;

            // Draw rotated image
            tempCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
            tempCtx.rotate(radians);
            tempCtx.drawImage(
                image,
                -naturalWidth / 2,
                -naturalHeight / 2,
                naturalWidth,
                naturalHeight
            );

            // Set final canvas size to crop dimensions
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            // Draw cropped area from rotated image
            ctx.drawImage(
                tempCanvas,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }

                blob.name = fileName;
                resolve(blob);
            }, 'image/jpeg', 0.95);
        };

        image.onerror = (err) => reject(err);
    });
};
// Simple Autocomplete Input
const AutocompleteSelect = ({ value, onChange, placeholder, options, disabled }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const selected = options.find(opt => opt.id === value);
        if (selected) {
            setSearch(selected.name);
        }
    }, [value, options]);

    const filtered = options.filter(opt =>
        opt.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box position="relative">
            <Input
                placeholder={placeholder}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 150)}
                bg="white"
                isDisabled={disabled}
                autoComplete="off"
            />
            {isOpen && filtered.length > 0 && (
                <Box
                    position="absolute"
                    top="full"
                    left={0}
                    right={0}
                    bg="white"
                    border="1px solid #ccc"
                    borderRadius="md"
                    zIndex={10}
                    maxH="200px"
                    overflowY="auto"
                >
                    <List spacing={0}>
                        {filtered.map(opt => (
                            <ListItem
                                key={opt.id}
                                px={3}
                                py={2}
                                _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                                onClick={() => {
                                    onChange(opt.id);
                                    setSearch(opt.name);
                                    setIsOpen(false);
                                }}
                            >
                                {opt.name}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};


// STEP 1: Image Management with Fixed Integrated Crop
const ImageManagementModal = ({ isOpen, onClose, onNext, initialImages = [] }) => {
    const toast = useToast();
    const [images, setImages] = useState(initialImages);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const scrollContainerRef = useRef(null);
    const cardRefs = useRef([]);
    const [editingIndex, setEditingIndex] = useState(null);



    useEffect(() => {
        setImages(initialImages);
    }, [initialImages]);

    const handleImageAdd = (e) => {
        const files = Array.from(e.target.files || []);
        const currentImageCount = images.length;
        const availableSlots = 6 - currentImageCount;

        if (availableSlots <= 0) {
            toast({
                title: "Maximum images reached",
                description: "You can only add up to 6 images.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const filesToAdd = files.slice(0, availableSlots);
        if (files.length > availableSlots) {
            toast({
                title: "Some images not added",
                description: `Only ${availableSlots} more images can be added. Maximum is 6 images.`,
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
        }

        const newImages = filesToAdd.map(file => ({
            url: URL.createObjectURL(file),
            file: file,
            needsUpload: true
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleImageDelete = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const handleCropStart = (index) => {
        setIsCropping(true);
        setEditingIndex(index); // new state to know which image is being cropped
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
    };


    const handleCropCancel = () => {
        setIsCropping(false);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
    };

    const handleCropComplete = (_, croppedArea) => {
        setCroppedAreaPixels(croppedArea);
    };


    const prepareImageForCrop = async (imageUrl) => {
        // If it's already a local blob (from File input), skip proxy
        if (imageUrl.startsWith("blob:") || imageUrl.startsWith("data:")) {
            return imageUrl;
        }

        // Otherwise, fetch via proxy to avoid CORS
        const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };


    const handleCropSave = async () => {
        try {
            const currentImage = images[editingIndex];
            let imageUrl = currentImage?.url || currentImage;

            imageUrl = await prepareImageForCrop(imageUrl);
            const croppedBlob = await getCroppedImg(
                imageUrl,
                croppedAreaPixels,  // This should be the pixel coordinates from onCropComplete
                rotation,           // Rotation angle
                `cropped-${Date.now()}.jpg`
            );

            const croppedFile = new File([croppedBlob], `cropped-${Date.now()}.jpg`, { type: "image/jpeg" });
            const newUrl = URL.createObjectURL(croppedFile);

            const updated = [...images];
            updated[editingIndex] = { url: newUrl, file: croppedFile, needsUpload: true };
            setImages(updated);

            setIsCropping(false);
            setEditingIndex(null);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setCroppedAreaPixels(null);

            toast({
                title: "Image cropped successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error("Crop failed", err);
            toast({
                title: "Failed to crop image",
                description: err.message || "Please try again",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };


    const handleCardClick = (index) => {
        if (isCropping) return;

        const card = cardRefs.current[index];
        const container = scrollContainerRef.current;
        if (card && container) {
            // compute left needed to center the card
            const left = card.offsetLeft - (container.clientWidth - card.offsetWidth) / 2;
            container.scrollTo({ left, behavior: 'smooth' });
        }

        // // still update index immediately (UI feedback)
        // setCurrentImageIndex(index);
    };


    const handleNext = () => {
        if (images.length === 0) {
            toast({
                title: "No images selected",
                description: "Please add at least one image to continue.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        onNext(images);
    };

    // If in cropping mode, show the crop interface
    if (isCropping) {
        const currentImage = images[editingIndex];
        const imageUrl = currentImage?.url || currentImage;

        return (
            <PostcardModal
                isShow={isOpen}
                headerText="Add Your Photos"
                handleClose={onClose}
                ModalContentW={["95vw", "90vw", "30vw"]}
                ModalContentH={"auto"}
                size="6xl"
                headerRightComponent={
                    <Button
                        bg="white"
                        textColor="primary_3"
                        hover="b"
                        onClick={() => {
                            handleCropSave();
                            handleNext();
                        }}
                        isDisabled={images.length === 0}
                        borderRadius="full"
                        px={4}
                        py={2}
                        fontSize={["4.8vw", "2vw", "1.7vw", "1vw"]}
                        _hover={{ bg: "white", color: "primary_3" }}
                    >
                        Next
                    </Button>

                }
            >
                <Box w={"full"} h={"auto"} position="relative">
                    <VStack w={["90vw", "90vw", "full"]} h="auto">
                        <Box
                            position="relative"
                            w="full"
                            h={["60vh", "70vh"]}
                            bg="black"
                        // overflow="hidden"
                        >
                            {/* Buttons */}
                            <HStack
                                position="absolute"
                                top="10px"
                                right="10px"
                                spacing={2}
                                zIndex="10" // Ensure buttons are always on top
                            >
                                <Button size="sm" variant="outline" onClick={handleCropCancel}>
                                    <MdClose />
                                </Button>
                                <Button
                                    size="sm"
                                    colorScheme="blue"
                                    onClick={handleCropSave}
                                    isDisabled={!croppedAreaPixels}
                                >
                                    <MdCheck />
                                </Button>
                            </HStack>

                            {/* Cropper */}
                            <Cropper
                                image={imageUrl}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={4 / 5}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onRotationChange={setRotation}
                                onCropComplete={handleCropComplete}
                                style={{
                                    containerStyle: {
                                        width: "100%",
                                        height: "100%",
                                        position: "relative",
                                    },
                                }}
                            />

                            {/* Bottom Left Controls (Zoom & Rotation) */}
                            <HStack
                                position="absolute"
                                bottom="10px"
                                left="10px"
                                spacing={2}
                                zIndex="10" // Ensure this is on top too if needed
                            >
                                {/* Rotation Control */}
                                <Flex direction="row" align="center" gap={1}>
                                    <IconButton
                                        size="sm"
                                        icon={<MdOutlineRotateLeft />}
                                        onClick={() => setRotation(r => r - 90)}
                                        aria-label="Rotate left"
                                    />
                                    <IconButton
                                        size="sm"
                                        icon={<MdOutlineRotateRight />}
                                        onClick={() => setRotation(r => r + 90)}
                                        aria-label="Rotate right"
                                    />
                                </Flex>
                            </HStack>
                        </Box>
                    </VStack>
                </Box>
            </PostcardModal >


        );
    }

    // If no images, show the empty state
    if (images.length === 0) {
        return (
            <PostcardModal
                isShow={isOpen}
                headerText="Add Your Photos"
                handleClose={onClose}
                size="6xl"
                headerRightComponent={
                    <Button
                        bg="white"
                        textColor="primary_3"
                        isDisabled={images.length === 0}
                        borderRadius="full"
                        px={4}
                        py={2}
                        fontSize={["4.8vw", "2vw", "1.7vw", "1vw"]}
                        _hover={{ bg: "white", color: "primary_3" }}
                    >
                        Next
                    </Button>

                }
            >
                <Box py={8} w={["90vw", "full"]}>
                    <VStack spacing={6} align="center">
                        <Box
                            p={16}
                            border="2px dashed"
                            borderColor="gray.300"
                            borderRadius="md"
                            textAlign="center"
                            color="gray.500"
                            bg="gray.50"
                            w="full"
                            maxW="500px"
                        >
                            <Text fontSize="lg" mb={4}>No photos yet</Text>
                            <Button
                                colorScheme="blue"
                                size="lg"
                                onClick={() => document.getElementById('image-upload').click()}
                            >
                                Add Your First Photo
                            </Button>
                            <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                display="none"
                                onChange={handleImageAdd}
                            />
                        </Box>




                    </VStack>
                </Box>
            </PostcardModal>
        );
    }

    // Main sliding interface
    return (
        <PostcardModal
            isShow={isOpen}
            headerText="Add Your Photos"
            handleClose={onClose}
            ModalContentW={["95vw", "40vw", "40vw", "30vw"]}
            ModalContentH="fit-content"
            size="6xl"
            headerRightComponent={
                <Button
                    bg="white"
                    textColor="primary_3"
                    onClick={handleNext}
                    isDisabled={images.length === 0}
                    borderRadius="full"
                    px={4}
                    py={2}
                    fontSize={["4.8vw", "2vw", "1.7vw", "1vw"]}
                    _hover={{ bg: "white", color: "primary_3" }}
                >
                    Next
                </Button>

            }
        >
            <Box w={["90vw", "full"]}>
                <VStack spacing={6} w="full" h="full">
                    {/* Sliding Images Container */}
                    <Box w="full" position="relative">
                        <Box
                            ref={scrollContainerRef}
                            w="full"
                            h="full"
                            overflowX="auto"
                            overflowY="hidden"
                            css={{
                                '&::-webkit-scrollbar': { display: 'none' },
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                scrollSnapType: 'x mandatory',
                                WebkitOverflowScrolling: 'touch',
                            }}
                        >
                            <Flex
                                h="full"
                                gap={4}
                                pb={2}
                            >
                                {/* Image Cards */}
                                {images.map((image, index) => {
                                    const imageUrl = image?.url || image;
                                    return (
                                        <Box
                                            key={index}
                                            data-index={index}
                                            ref={(el) => (cardRefs.current[index] = el)}
                                            minW="85%"
                                            h="full"
                                            position="relative"
                                            cursor="pointer"
                                            transition="all 0.3s ease"
                                            transform="scale(1)"
                                            opacity={1}
                                            onClick={handleCardClick}
                                        >
                                            <Box
                                                position="relative"
                                                h="full"
                                                bg="gray.100"
                                                borderRadius="lg"
                                                overflow="hidden"
                                                border={"2px solid"}
                                                borderColor={"gray.200"}
                                                shadow={"md"}
                                            >
                                                <AspectRatio ratio={4 / 5} w="auto" h={["auto"]}>
                                                    <Image
                                                        src={imageUrl}
                                                        alt={`Memory ${index + 1}`}
                                                        w="full"
                                                        h="full"
                                                        objectFit="cover"
                                                        onError={(e) => {
                                                            console.error('Image failed to load:', e);
                                                        }}
                                                    />
                                                </AspectRatio>


                                                <Box
                                                    position="absolute"
                                                    top={2}
                                                    right={2}
                                                    p={2}
                                                    bg="blackAlpha.700"
                                                    borderRadius="md"
                                                >
                                                    <Flex gap={2}>
                                                        <IconButton
                                                            icon={<MdEdit />}
                                                            size="sm"
                                                            colorScheme="blue"
                                                            variant="solid"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCropStart(index);
                                                            }}
                                                            aria-label="Crop image"
                                                        />
                                                        <IconButton
                                                            icon={<MdDelete />}
                                                            size="sm"
                                                            colorScheme="red"
                                                            variant="solid"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleImageDelete(index);
                                                            }}
                                                            aria-label="Delete image"
                                                        />
                                                    </Flex>
                                                </Box>

                                                {/* <Box
                                                    position="absolute"
                                                    bottom={2}
                                                    left={2}
                                                    px={3}
                                                    py={1}
                                                    bg="blackAlpha.700"
                                                    color="white"
                                                    borderRadius="md"
                                                    fontSize="sm"
                                                    fontWeight="medium"
                                                >
                                                    {index + 1} of {images.length}
                                                </Box> */}
                                            </Box>
                                        </Box>
                                    );
                                })}

                                {/* Add Image Card - Only show if less than 6 images */}
                                {images.length < 6 && (
                                    <Box
                                        minW="85%"
                                        maxW="85%"
                                        position="relative"

                                    >
                                        <AspectRatio ratio={4 / 5} w="full" h={["full"]}>
                                            <Box
                                                h="full"
                                                cursor="pointer"
                                                onClick={() =>
                                                    document.getElementById('image-upload-additional').click()
                                                }
                                                bg="gray.50"
                                                border="2px dashed"
                                                borderColor="gray.300"
                                                borderRadius="lg"
                                                display="flex"
                                                flexDirection="column"
                                                alignItems="center"
                                                justifyContent="center"
                                                transition="all 0.3s ease"
                                                _hover={{
                                                    borderColor: 'blue.400',
                                                    bg: 'blue.50',
                                                }}
                                            >
                                                <VStack spacing={4} color="gray.500">
                                                    <Box fontSize="4xl">
                                                        <MdAdd />
                                                    </Box>
                                                    <VStack spacing={1}>
                                                        <Text fontSize="lg" fontWeight="medium">
                                                            Add Photos
                                                        </Text>
                                                        <Text fontSize="sm" textAlign="center">
                                                            Tap to add more photos<br />
                                                            ({images.length} of 6)
                                                        </Text>
                                                    </VStack>
                                                </VStack>
                                            </Box>
                                        </AspectRatio>
                                    </Box>
                                )}

                            </Flex>
                        </Box>
                    </Box>
                </VStack>

                {/* Hidden File Input */}
                <Input
                    id="image-upload-additional"
                    type="file"
                    accept="image/*"
                    multiple
                    display="none"
                    onChange={handleImageAdd}
                />
            </Box>
        </PostcardModal>
    );
};

// STEP 2: Memory Details Form with Read-only Images
const MemoryDetailsModal = ({ isOpen, onClose, onSuccess, onBack, images, initialData = null }) => {
    const toast = useToast();
    const { profile } = useContext(AppContext);
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const today = new Date().toISOString().split('T')[0];

    const getInitialValues = () => {
        if (!initialData) return { ...DEFAULT_FORM_VALUES, gallery: images };
        return {
            name: initialData.name || '',
            date: initialData.date ? initialData.date.split('T')[0] : null,
            intro: initialData.intro || '',
            region: initialData.region?.id || '',
            country: initialData.country?.id || '',
            gallery: images,
            signature: initialData.signature || '',
            externalUrl: initialData.externalUrl || '',
            shareType: initialData.shareType || 'private',
        };
    };

    const fetchCountries = useCallback(async () => {
        try {
            const res = await fetchPaginatedResults('countries', {}, { fields: ['id', 'name'] }, "name:ASC");
            setCountries(Array.isArray(res) ? res : [res]);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    }, []);

    const fetchRegions = useCallback(async (countryId) => {
        if (!countryId) {
            setRegions([]);
            return;
        }
        try {
            const res = await fetchPaginatedResults('regions', { country: countryId }, { fields: ['id', 'name'] }, "name:ASC");
            setRegions(Array.isArray(res) ? res : [res]);
        } catch (error) {
            console.error("Error fetching regions:", error);
        }
    }, []);

    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            if (!profile) {
                toast({
                    title: "Error",
                    description: "User not found. Please log in again.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                setSubmitting(false);
                return;
            }

            const imagesToUpload = values.gallery.filter(img => img.file && img.url?.startsWith('blob:'));
            if (imagesToUpload.length > 0) {
                toast({
                    title: `Uploading ${imagesToUpload.length} image(s)...`,
                    status: "info",
                    duration: 2000,
                    isClosable: true,
                });
            }

            const uploadedGallery = await Promise.all(
                values.gallery.map(async (image) => {
                    if (typeof image === 'string' || (image.id && !image.file)) {
                        return image;
                    }

                    if (image.file && image.url?.startsWith('blob:')) {
                        try {
                            const uploadedImage = await uploadImageToServer(image.file);
                            return uploadedImage;
                        } catch (error) {
                            console.error('Failed to upload image:', error);
                            throw new Error(`Failed to upload image`);
                        }
                    }

                    return image;
                })
            );

            const payload = {
                name: values.name || "",
                slug: values.name ? slugify(values.name) : uuidv4(),
                date: values.date || null,
                intro: values.intro || "",
                country: values.country ? parseInt(values.country) : null,
                region: values.region ? parseInt(values.region) : null,
                signature: profile?.fullName || "",
                externalUrl: values.externalUrl || "",
                shareType: values.shareType,
                gallery: uploadedGallery.filter(img => img && !img.isLoading && !img.isUploading),
                user: profile?.id,
            };

            let result;
            if (initialData?.id) {
                result = await updateDBValue("memories", initialData.id, payload);
            } else {
                result = await createDBEntry("memories", payload);
            }

            toast({
                title: `Memory ${initialData?.id ? "Updated" : "Added"}`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            onSuccess(result);
            onClose();
        } catch (err) {
            console.error("Error saving memory", err);
            toast({
                title: err.message || "Failed to save memory",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={getInitialValues()}
            enableReinitialize
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue, isSubmitting, submitForm }) => {
                useEffect(() => {
                    if (values.country) {
                        fetchRegions(values.country);
                    } else {
                        setRegions([]);
                    }
                }, [values.country, fetchRegions]);

                return (
                    <PostcardModal
                        isShow={isOpen}
                        headerText={initialData?.id ? "Edit Your Memory" : "Add Memory Details"}
                        handleClose={onClose}
                        size="6xl"
                        ModalContentW={["95vw", "auto"]}
                        ModalContentH={["90vh", "auto"]}
                        headerRightComponent={
                            <Button
                                color="primary_3"
                                bg="white"
                                isLoading={isSubmitting}
                                loadingText="Saving..."
                                onClick={submitForm}
                                borderRadius="full"
                                px={4}
                                py={2}
                                fontSize={["4.8vw", "2vw", "1.7vw", "1vw"]}
                                _hover={{ bg: "white", color: "primary_3" }}
                            >
                                Save
                            </Button>
                        }
                    >
                        <Form>
                            <Box py={2} w={["full"]}>
                                <Flex
                                    direction={['column', 'row']}
                                    gap={6}
                                    align={["stretch", 'flex-start']}
                                    minH="60vh"
                                    w={["85vw", "full"]}
                                    css={{
                                        '&::-webkit-scrollbar': { display: 'none' },
                                        '-ms-overflow-style': 'none',
                                        'scrollbar-width': 'none',
                                    }}
                                >
                                    {/* Left side: Responsive Gallery */}
                                    <Box flex={{ base: "1", md: "0 0 55%" }} order={{ base: 1, md: 1 }}>
                                        {/* Mobile: Slider */}
                                        <Box display={{ base: "block", md: "none" }} w="full" overflowX="auto" whiteSpace="nowrap">
                                            <Flex gap={1} overflowX="scroll" css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                                                {images.map((img, idx) => (
                                                    <AspectRatio ratio={4 / 5} w="full" h="full">
                                                        <Box
                                                            key={idx}
                                                            flex="0 0 auto"
                                                            w="80%"
                                                            h="200px"
                                                            borderRadius="md"
                                                            overflow="hidden"
                                                            border="1px solid #eaeaea"
                                                        >
                                                            <Box
                                                                as="img"
                                                                src={img.url || img}
                                                                onClick={onBack}
                                                                alt={`gallery-mobile-${idx}`}
                                                                w="full"
                                                                h="full"
                                                                objectFit="cover"
                                                            />
                                                        </Box>
                                                    </AspectRatio>
                                                ))}
                                            </Flex>
                                        </Box>

                                        {/* Desktop: Grid */}
                                        <Flex display={{ base: "none", md: "flex" }} flexWrap="wrap" w="100%" h="60vh" overflow="hidden">
                                            {images.slice(0, 6).map((img, index) => {
                                                const count = images.length;
                                                let width = "100%";
                                                let height = "100%";
                                                let borderRadius = "0";

                                                if (count === 1) {
                                                    width = "100%"; height = "100%";
                                                    borderRadius = "1.563vw 1.563vw 0 0";
                                                } else if (count === 2) {
                                                    width = "50%"; height = "100%";
                                                    borderRadius = index === 0 ? "1.563vw 0 0 0" : "0 1.563vw 0 0";
                                                } else if (count === 3) {
                                                    width = index < 2 ? "50%" : "100%";
                                                    height = "50%";
                                                    borderRadius = index === 0 ? "1.563vw 0 0 0" : index === 1 ? "0 1.563vw 0 0" : "0";
                                                } else if (count === 4) {
                                                    width = "50%"; height = "50%";
                                                    borderRadius = index === 0 ? "1.563vw 0 0 0" : index === 1 ? "0 1.563vw 0 0" : "0";
                                                } else if (count === 5) {
                                                    width = index < 3 ? "33.33%" : "50%";
                                                    height = "50%";
                                                    borderRadius = index === 0 ? "1.563vw 0 0 0" : index === 2 ? "0 1.563vw 0 0" : "0";
                                                } else if (count >= 6) {
                                                    width = "33.33%"; height = "50%";
                                                    borderRadius = index === 0 ? "1.563vw 0 0 0" : index === 2 ? "0 1.563vw 0 0" : "0";
                                                }

                                                return (
                                                    <Box
                                                        key={index}
                                                        width={width}
                                                        height={height}
                                                        overflow="hidden"
                                                        flexShrink={0}
                                                    >
                                                        <Box
                                                            as="figure"
                                                            w="100%"
                                                            h="100%"
                                                            overflow="hidden"
                                                            border="1px solid #eaeaea"
                                                            borderRadius="6px"
                                                        >
                                                            <Box
                                                                as="img"
                                                                src={img.url || img}
                                                                alt={`gallery-${index}`}
                                                                loading="lazy"
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                    transition: "transform 0.3s ease",
                                                                }}
                                                                cursor="pointer"
                                                                onClick={onBack}
                                                                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                                                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                                            />
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Flex>
                                    </Box>


                                    {/* Right side: Form */}
                                    <Box
                                        flex={{ base: '1', md: '1' }}
                                        order={{ base: 2, md: 2 }}
                                        w="full"
                                        // Only scrollable on desktop
                                        overflowY={{ base: "visible", md: "auto" }}
                                        maxH={{ base: "none", md: "65vh" }}
                                        pr={2}
                                        css={{
                                            '&::-webkit-scrollbar': { display: 'none' },   // Chrome, Safari
                                            '-ms-overflow-style': 'none',                  // IE/Edge
                                            'scrollbar-width': 'none',                     // Firefox
                                        }}
                                    >
                                        <VStack spacing={4} align="stretch">
                                            {/* Share toggle */}
                                            <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                                <FormLabel mb="0">Public Memory</FormLabel>
                                                <Field name="shareType">
                                                    {({ field }) => (
                                                        <Switch
                                                            isChecked={field.value === 'public'}
                                                            onChange={(e) =>
                                                                setFieldValue('shareType', e.target.checked ? 'public' : 'private')
                                                            }
                                                            colorScheme="teal"
                                                        />
                                                    )}
                                                </Field>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Title</FormLabel>
                                                <Field as={Input} bg="white" name="name" autoComplete="off" />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Travel Note</FormLabel>
                                                <Field
                                                    as={Textarea}
                                                    bg="white"
                                                    name="intro"
                                                    autoComplete="off"
                                                    minH="100px"
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Website</FormLabel>
                                                <Field as={Input} bg="white" name="externalUrl" autoComplete="off" />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Date</FormLabel>
                                                <Field as={Input} bg="white" type="date" name="date" max={today} />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Country</FormLabel>
                                                <AutocompleteSelect
                                                    value={values.country}
                                                    onChange={(val) => {
                                                        setFieldValue('country', val);
                                                        setFieldValue('region', '');
                                                    }}
                                                    placeholder="Select country..."
                                                    options={countries}
                                                />
                                            </FormControl>

                                            <FormControl isDisabled={!values.country}>
                                                <FormLabel>Region</FormLabel>
                                                <AutocompleteSelect
                                                    value={values.region}
                                                    onChange={(val) => setFieldValue('region', val)}
                                                    placeholder="Select region..."
                                                    options={regions}
                                                    disabled={!values.country}
                                                />
                                            </FormControl>
                                        </VStack>
                                    </Box>

                                </Flex>
                            </Box>
                        </Form>
                    </PostcardModal>
                );
            }}
        </Formik>

    );
};

// MAIN COMPONENT: Two-Step Memory Modal Controller
const UserMemoriesForm = ({ isOpen, onClose, onSuccess, onRefresh, initialData = null }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedImages, setSelectedImages] = useState(initialData?.gallery || []);

    // Reset to step 1 when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            setSelectedImages(initialData?.gallery || []);
        }
    }, [isOpen, initialData]);

    const handleStep1Next = (images) => {
        setSelectedImages(images);
        setCurrentStep(2);
    };

    const handleStep2Back = () => {
        setCurrentStep(1);
    };

    const handleClose = () => {
        setCurrentStep(1);
        setSelectedImages([]);
        onClose();
    };

    const handleSuccess = (result) => {
        setCurrentStep(1);
        setSelectedImages([]);

        // Call the refresh function to reload memories
        if (onRefresh) {
            onRefresh();
        }

        // Call the original onSuccess callback
        if (onSuccess) {
            onSuccess(result);
        }
    };

    return (
        <>
            {/* Step 1: Image Management */}
            <ImageManagementModal
                isOpen={isOpen && currentStep === 1}
                onClose={handleClose}
                onNext={handleStep1Next}
                initialImages={selectedImages}
            />

            {/* Step 2: Memory Details Form */}
            <MemoryDetailsModal
                isOpen={isOpen && currentStep === 2}
                onClose={handleClose}
                onSuccess={handleSuccess}
                onBack={handleStep2Back}
                images={selectedImages}
                initialData={initialData}
            />
        </>
    );
};
export default UserMemoriesForm;