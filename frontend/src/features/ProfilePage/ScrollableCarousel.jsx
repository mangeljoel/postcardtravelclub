import { Box, Image, Flex, useToast, IconButton } from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import UploadImage from './UploadImage';
import AppContext from '../AppContext';
import { EditIcon } from '@chakra-ui/icons';
import { getUrlOfUploadImage } from '../../services/utilities';
import { getExpertbyUserLink, updateDBValue } from '../../queries/strapiQueries';

const ScrollableCarousel = ({ isSmall, isOwner, edit, editProfile, coverImages = [], setCoverImages }) => {
    // console.log(coverImages)
    const { profile, updateUser } = useContext(AppContext)
    const toast = useToast();
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null); // Use ref to store the interval ID

    // Function to clear the existing interval and start a new one
    const startAutoSlide = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current); // Clear the previous interval
        }

        intervalRef.current = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % (coverImages?.length < 3 ? coverImages.length + (isOwner ? 1 : 0) : coverImages.length)); // Including UploadImage in the total count
        }, 3000); // Auto slide every 3 seconds
    };

    // Start the auto slide interval when the component mounts and reset when currentIndex changes
    useEffect(() => {
        startAutoSlide(); // Start interval when component mounts

        return () => clearInterval(intervalRef.current); // Clean up the interval on unmount
    }, [currentIndex, coverImages?.length]); // Restart interval on index change

    // Scroll to the respective image when currentIndex changes
    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            const cardWidth = carousel.offsetWidth;
            carousel.scrollTo({
                left: currentIndex * cardWidth,
                behavior: 'smooth',
            });
        }
    }, [currentIndex]);

    // Handle manual indicator click to scroll to the respective image
    const handleIndicatorClick = (index) => {
        setCurrentIndex(index); // Update the currentIndex
    };

    const inputFileRef = useRef(null);
    const [editImageIndex, setEditImageIndex] = useState(null);

    const handleEditClick = (index) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current); // Stop auto-slide when edit button is clicked
        }
        setEditImageIndex(index);
        inputFileRef.current.click();
    };

    // Handle the file input change
    const handleFileChange = async (event) => {
        const files = event.target.files;
        const selectedFile = files[0]; // Only allow one file at a time for editing

        if (!selectedFile) return; // If no file is selected, return early

        try {
            const images = [];
            await getUrlOfUploadImage(selectedFile, (result) => {
                if (result?.id && result.url) {
                    images.push({ id: result.id, url: result.url });
                }
            });

            if (images.length > 0) {
                // Replace the image at the specific index
                const updatedImages = coverImages.map((img, idx) =>
                    idx === editImageIndex ? images[0] : img
                );

                // Update the database and UI
                updateDBValue('users', profile?.id, { coverImage: updatedImages.map(image => image.id) }).then(async (response) => {
                    const user = await getExpertbyUserLink(profile.slug);
                    await updateUser(Array.isArray(user) ? user[0] : user);
                    setCoverImages && setCoverImages(updatedImages);
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            startAutoSlide()
        }
    };

    return (
        <Box w={"100%"} h={"100%"} position={"relative"} borderRadius={isSmall ? ["3.89vw", "1.04vw"] : ["4.167vw", "2.083vw"]}>
            <Box
                ref={carouselRef}
                position={"relative"}
                className={"no-scrollbar"}
                overflow="hidden" // Disable manual scrolling
                scrollSnapType="x mandatory"
                w="100%"
                h={"100%"}
                borderRadius={isSmall ? ["3.89vw", "1.04vw"] : ["4.167vw", "2.083vw"]}
            >
                {/* Hidden input for image upload */}
                <input
                    type="file"
                    ref={inputFileRef}
                    style={{ display: "none" }}
                    multiple={false}
                    accept="image/*" // Accept only image files
                    onChange={handleFileChange}
                />
                <Flex w={`100%`} h="100%" gap={"2vw"} borderRadius={isSmall ? ["3.89vw", "1.04vw"] : ["4.167vw", "2.083vw"]}>
                    {coverImages?.map((img, index) => (
                        <Box
                            key={index}
                            flex="none"
                            w="100%"
                            h="100%"
                            scrollSnapAlign="start"
                            position="relative"
                            borderRadius={isSmall ? ["3.89vw", "1.04vw"] : ["4.167vw", "2.083vw"]}
                            style={{
                                opacity: index === currentIndex ? 1 : 0,
                                transition: 'opacity 1s ease-in-out', // Add fade transition
                            }}
                        >
                            <Image src={img.url} borderRadius={isSmall ? ["3.89vw", "1.04vw"] : ["4.167vw", "2.083vw"]} alt={`carousel-image-${index}`} w="100%" h="100%" objectFit="cover" />
                            {/* Show edit icon if isOwner is true */}
                            {isOwner && !isSmall && (
                                <IconButton
                                    variant={"none"}
                                    color={"#EFE9E4"}
                                    icon={<EditIcon w={["60%", "80%"]} h={["60%", "80%"]} />}
                                    position="absolute"
                                    top="12px"
                                    right="12px"
                                    onClick={() => handleEditClick(index)} // Handle edit click
                                    aria-label="Edit Image"
                                />
                            )}
                        </Box>
                    ))}

                    {/* Add UploadImage component as a carousel item */}
                    {isOwner && (coverImages?.length < 3) && (
                        <Box
                            flex="none"
                            w="100%"
                            h="100%"
                            scrollSnapAlign="start"
                            position="relative"
                            borderRadius={isSmall ? ["3.89vw", "1.04vw"] : ["4.167vw", "2.083vw"]}
                        >
                            <UploadImage edit={edit} editProfile={editProfile} coverImages={coverImages} setCoverImages={setCoverImages} intervalRef={intervalRef} startAutoSlide={startAutoSlide} />
                        </Box>
                    )}
                </Flex>
            </Box>

            {/* Indicators */}
            <Flex
                position="absolute"
                bottom={["2.78vw", "1.5vw"]}
                right={["3.61vw", "2.15vw"]}
                zIndex={5}
                gap={["1.67vw", "0.5vw"]}
            >
                {/* Indicators for images */}
                {coverImages?.map((_, index) => (
                    <Box
                        key={index}
                        w={["2.78vw", "0.9vw"]}
                        h={["2.78vw", "0.9vw"]}
                        bg={index === currentIndex ? "primary_1" : "#EFE9E4"}
                        borderRadius="100%"
                        cursor="pointer"
                        onClick={() => handleIndicatorClick(index)} // Handle click event
                    />
                ))}

                {/* Indicator for the UploadImage component */}
                {isOwner && (coverImages?.length < 3 && coverImages?.length > 0) && (
                    <Box
                        w={["2.78vw", "0.9vw"]}
                        h={["2.78vw", "0.9vw"]}
                        bg={currentIndex === coverImages?.length ? "primary_1" : "#EFE9E4"}
                        borderRadius="100%"
                        cursor="pointer"
                        onClick={() => handleIndicatorClick(coverImages?.length)} // Handle click event for UploadImage
                    />
                )}
            </Flex>
        </Box>
    );
};

export default ScrollableCarousel;
