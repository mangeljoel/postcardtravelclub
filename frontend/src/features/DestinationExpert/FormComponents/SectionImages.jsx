import { Flex, Input } from "@chakra-ui/react";
import { FieldArray } from "formik";
import { memo } from "react";
import ImagePreview from "./ImagePreview";
import AddImage from "../../CreatePostcardPage/Properties/AddImage";
import { useState, useRef } from "react";
import ImageCropModal from "../../../patterns/ImageCropModal";

const SectionImages = memo(({ section, index, onImageUpload }) => {
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingImageIndex, setEditingImageIndex] = useState(null);
    const inputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setCropModalOpen(true);
        } else {
            alert('Please select a valid image file');
        }
    };

    const handleCroppedFile = (croppedFile, pushImage, replaceImageAtIndex = null) => {
        const syntheticEvent = {
            target: {
                files: [croppedFile]
            }
        };

        if (replaceImageAtIndex !== null) {
            // Replace image at specific index
            onImageUpload(syntheticEvent, (newImage) => {
                section.media[replaceImageAtIndex] = newImage; // direct mutation won't trigger Formik updates
            }, replaceImageAtIndex);
        } else {
            // Normal image add
            onImageUpload(syntheticEvent, pushImage);
        }

        if (inputRef.current) inputRef.current.value = '';
        setSelectedFile(null);
        setEditingImageIndex(null);
    };

    const handleCloseCropModal = () => {
        setCropModalOpen(false);
        setSelectedFile(null);
        // Reset the file input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <FieldArray name={`dxSections.${index}.media`}>
            {({ remove: removeImage, push: pushImage }) => (
                <>
                    <Flex my={8} gap={4}>
                        {section?.media?.map((image, imgIndex) => (
                            <ImagePreview
                                key={imgIndex}
                                image={image}
                                onRemove={() => removeImage(imgIndex)}
                                onCrop={() => {
                                    setSelectedFile({ ...image, isUrl: true }); // Custom format to indicate it's a URL
                                    setCropModalOpen(true);
                                    setEditingImageIndex(imgIndex);
                                }}
                            />
                        ))}
                        {(!section?.media || section?.media?.length < 6) && (
                            <>
                                <AddImage
                                    my="auto"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        inputRef.current?.click();
                                    }}
                                    text="Add Image"
                                />
                                <Input
                                    ref={inputRef}
                                    id={`file-input-section-${index}`}
                                    type="file"
                                    accept="image/*"
                                    display="none"
                                    mt={2}
                                    onChange={handleFileChange}
                                />
                            </>
                        )}
                    </Flex>

                    {/* Crop Modal */}
                    {cropModalOpen && selectedFile && (
                        <ImageCropModal
                            file={selectedFile}
                            isOpen={cropModalOpen}
                            onClose={handleCloseCropModal}
                            onCropComplete={(croppedFile) =>
                                handleCroppedFile(croppedFile, pushImage, editingImageIndex)
                            }
                        />
                    )}
                </>
            )}
        </FieldArray>
    );
});

export default SectionImages;