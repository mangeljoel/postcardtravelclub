import { Button, Icon, Input, useDisclosure, useToast, Image } from "@chakra-ui/react";

import GalleryView from "../../features/DestinationExpert/GalleryView";
import { useEffect, useState, useRef, useCallback } from "react";
import { createDBEntry, fetchPaginatedResults, updateDBValue } from "../../queries/strapiQueries";
import StaticImageCropModal from "../ImageCropModal/StaticImageCropModal";
import PostcardAlert from "../../features/PostcardAlert";
import { fixImageOrientation, getUrlOfUploadImage } from "../../services/utilities";
import { ChakraNextImage } from "../ChakraNextImage";

const MemoriesUpload = ({ type, data, profile, onChange, isOwner, triggerUpload }) => {
    const galleryMode = useDisclosure();
    const [loading, isLoading] = useState(true);
    const [filterData, setFilterData] = useState(null);
    const [showData, setShowData] = useState(null);
    const [blockId, setBlockId] = useState(null);
    const [blockImageEdit, setBlockImageEdit] = useState({ mode: null, index: null });
    const [cropModalOpen, setCropModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [note, setNote] = useState('')
    const toast = useToast()
    const fileInputRef = useRef();
    const uploadRef = useRef();
    const showToast = useCallback((title, status = 'info', variant = 'subtle') => {
        toast({ title, status, isClosable: true, position: 'top', variant })
    }, [toast]);
    const [uploadProgress, setUploadProgress] = useState({});

    const MAX_IMAGES_PER_BLOCK = 6
    useEffect(() => {
        if (data) {
            let filter = {
            }
            if (type == "postcard")
                filter = {
                    postcard: data?.id,
                    user: profile?.id
                }
            else if (type == "restaurant")
                filter = {
                    album: data?.id,
                    user: profile?.id
                }
            else if (type == "album")
                filter = {
                    album: data?.id,
                    user: profile?.id
                }

            else if (type == "dxcard")


                filter = {
                    dx_card: data?.id,
                    user: profile?.id
                }

            else if (type == "personal")
                filter = {
                    id: data?.id
                }

            setFilterData(filter);
        }


    }, [type, data, profile]);
    const calculateInternalUrl = () => {
        if (!data) return ''
        if (type === "postcard") return "postcard-pages/" + data?.album?.slug;
        else if (type === "album") return "postcard-pages/" + data?.album?.slug;
        else return '';

    }
    const calculateExternalUrl = () => {
        if (!data) return ''
        if (type === "postcard") return data?.album?.website;
        else if (type === "album") return data?.website;
        else if (type === "restaurant") return data?.website;
        else return null;
    }
    const calculateIntro = () => {
        if (!data) return ''
        if (type === "postcard") return data?.intro;
        else if (type === "album") return data?.intro;
        else if (type === "restaurant") return data?.intro;
        else return null;
    }
    const calculateSignature = () => {
        if (!data) return ''
        if (type === "postcard") return data?.album?.signature;
        else if (type === "album") return data?.signature;
        else if (type === "restaurant") return data?.signature;
        else return null;
    }
    useEffect(() => {
        if (triggerUpload && triggerUpload?.state === "open")
            if (uploadRef) uploadRef?.current?.click();
    }, [triggerUpload])
    const fetchMemoryData = async () => {
        if (filterData) {
            let res = await fetchPaginatedResults("memories", filterData, { gallery: true, country: true, region: true, postcard: { album: true }, album: true, dx_card: true });
            let data = Array.isArray(res) ? res[0] : res;
            if (data) setShowData(data);
            return data;

        }
    }
    const handleImageUpload = useCallback((blockId, mode, index) => {
        setBlockId(blockId);
        if (mode === "crop") {
            setBlockImageEdit({ mode, index })
            if (index < showData?.gallery?.length) {
                setSelectedFile({ isUrl: true, ...showData?.gallery[index] })
                setNote(showData?.gallery[index]?.caption || '')
                setCropModalOpen(true)
            }
        } else if (mode === "delete") {
            setBlockImageEdit({ mode, index });
        } else {
            setBlockImageEdit({ mode: null, index: null })
            fileInputRef.current?.click()
        }
    }, [showData]);
    const convertIfHeic = async (file) => {
        if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
            if (typeof window === "undefined") {
                // Prevent running in SSR
                return null;
            }

            const heic2any = (await import("heic2any")).default;

            try {
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.9,
                });

                return new File([convertedBlob], file.name.replace(/\.heic$/i, ".jpg"), {
                    type: "image/jpeg",
                    lastModified: file.lastModified,
                });
            } catch (err) {
                console.error("HEIC conversion failed:", err);
                return null;
            }
        }

        return file;
    };

    const createMemory = async () => {
        await createDBEntry("memories", {
            ...filterData,
            country: data?.country?.id,
            region: data?.region?.id,
            name: data?.name,
            internalUrl: calculateInternalUrl(),
            externalUrl: calculateExternalUrl(),
            intro: calculateIntro(),
            date: new Date(),
            signature: calculateSignature(),
            shareType: "public"
        });

        return await fetchMemoryData(); // return the new memory
    };
    const handleFileChange = useCallback(async (e) => {

        const files = Array.from(e.target.files || [])
        if (files.length === 0) return
        let memory = showData;
        if (!memory) memory = await createMemory();
        // const block = blocks.find(b => b.id === blockId)


        const currentGallery = memory?.gallery ? [...memory?.gallery] : []
        const remainingSlots = MAX_IMAGES_PER_BLOCK - currentGallery.length

        if (files.length > remainingSlots) {
            showToast(`You can add up to ${remainingSlots} images`, 'warning')
            return
        }

        const loadingGallery = [
            ...currentGallery,
            ...Array.from({ length: files.length }, () => ({ isLoading: true }))
        ].slice(0, MAX_IMAGES_PER_BLOCK)

        setShowData((prevData) => ({ ...prevData, gallery: loadingGallery }));
        try {
            // Step 1: Fix orientation of each image
            const correctedFiles = await Promise.all(
                files.map(async (file) => {
                    const converted = await convertIfHeic(file);
                    if (!converted) return null;
                    return fixImageOrientation(converted);
                })
            );

            // Filter out failed conversions
            const validFiles = correctedFiles.filter(Boolean);

            // Step 2: Upload images using corrected files
            const uploadedImages = await Promise.all(
                validFiles.map((file, i) =>
                    new Promise(resolve => {
                        getUrlOfUploadImage(
                            file,
                            (image) => {
                                setUploadProgress(prev => {
                                    const copy = { ...prev };
                                    delete copy[i]; // cleanup after success
                                    return copy;
                                });

                                resolve(image);
                            },
                            '',
                            (percent) => {
                                ;
                                setUploadProgress(prev => ({ ...prev, [i]: percent }));
                            }
                        );
                    })
                )
            )
            console.log(uploadedImages);

            const newGallery = [...currentGallery, ...uploadedImages].slice(0, MAX_IMAGES_PER_BLOCK)
            setShowData((prevData) => ({ ...prevData, gallery: newGallery }));
            updateDBValue("memories", memory?.id, { gallery: newGallery }).then(() => { if (onChange) onChange(); })
            showToast("Images uploaded successfully", 'success')
        } catch (error) {
            console.error("Image upload failed", error)
            showToast("Failed to upload images", 'error')
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = ''
            setSelectedFile(null)
            setBlockImageEdit({ mode: null, index: null })
            setNote('')
        }
    }, [blockId, showData, showToast])

    const handleCroppedFile = useCallback(async (croppedFile, note = '') => {
        const { mode, index } = blockImageEdit;

        // // Step 1: Set loading placeholder using prevBlocks
        // setBlocks(prevBlocks => {
        //     const updated = prevBlocks.map(block => {
        //         if (block.id === blockId) {
        //             let newGallery = block.gallery ? [...block.gallery] : []
        //             const loadingPlaceholder = { isLoading: true }

        //             if (mode === "crop" && index != null) {
        //                 newGallery[index] = loadingPlaceholder
        //             } else {
        //                 newGallery.push(loadingPlaceholder)
        //             }

        //             return { ...block, gallery: newGallery }
        //         }
        //         return block
        //     })

        //     return updated
        // })

        // Step 2: Upload image and replace loading placeholder
        await getUrlOfUploadImage(croppedFile, async (image) => {


            let newGallery = showData.gallery ? [...showData.gallery] : []

            if (mode === "crop" && index != null) {
                newGallery[index] = image
            } else {
                const firstLoadingIndex = newGallery.findIndex(img => img?.isLoading)
                if (firstLoadingIndex !== -1) {
                    newGallery[firstLoadingIndex] = image
                } else {
                    newGallery.push(image)
                }
            }

            setShowData((prev) => ({ ...prev, gallery: newGallery }))



            // Also persist to DB after state update
            if (showData?.id) {
                updateDBValue("memories", showData.id, {
                    gallery: newGallery,
                }).then(() => {
                    if (onChange) onChange();
                })
            }


        }, note)

        // Step 3: Reset state
        if (fileInputRef.current) fileInputRef.current.value = ''
        setSelectedFile(null)
        setBlockImageEdit({ mode: null, index: null })
        setNote('')
    }, [blockImageEdit, blockId, showData])
    return <>
        <Button
            variant="none"
            ref={uploadRef}
            p={0}
            m={0}
            minW={["19px", "19px", "19px", "1.46vw"]}
            onClick={(e) => {
                e.stopPropagation();
                fetchMemoryData(type, data, profile);
                galleryMode.onOpen();
            }}
            color={"primary_1"}
        >
            {/* <Image
                src="/assets/gallery.svg"
                alt="gallery"
                width={["24px", "24px", "24px", "2vw"]}
                height={["24px", "24px", "24px", "2vw"]}
                cursor="pointer"
            /> */}
            <ChakraNextImage src="/assets/gallery.svg"
                alt="gallery"
                width={["24px", "24px", "24px", "2vw"]}
                height={["24px", "24px", "24px", "2vw"]}
                cursor="pointer" />
            {/* View Photos */}
            <GalleryView
                isOpen={galleryMode.isOpen}
                onClose={galleryMode.onClose}
                postcardData={showData}
                carouselMedia={showData?.gallery || []}
                allowImageUpload={type === "personal" ? isOwner ? true : false : true}
                onImageUpload={(mode, index) => handleImageUpload(showData?.id, mode, index)}
                uploadProgress={uploadProgress}
            />
        </Button>

        <>

            <Input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            {cropModalOpen && selectedFile && (
                <StaticImageCropModal
                    aspectRatio={5 / 6}
                    file={selectedFile}
                    isOpen={cropModalOpen}
                    onClose={() => {
                        setCropModalOpen(false)
                        setSelectedFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    onCropComplete={handleCroppedFile}
                    note={note}
                    setNote={setNote}
                />
            )}
        </>


        {/* Image Delete Alert */}

        <PostcardAlert
            show={{
                mode: blockImageEdit?.mode === "delete",
                message: "Are you sure you want to remove this image from the card gallery?"
            }}
            handleAction={async () => {
                try {
                    const { index } = blockImageEdit

                    let newGallery = [...(showData.gallery || [])]
                    if (index != null) {
                        newGallery.splice(index, 1)
                    }
                    setShowData((prev) => ({ ...prev, gallery: newGallery }));
                    updateDBValue("memories", showData?.id, { gallery: newGallery }).then(() => {
                        if (onChange) onChange();
                    })
                    setBlockImageEdit({ mode: null, index: null });
                } catch (error) {
                    console.error('Error removing image:', error)
                }
            }}
            closeAlert={() => setBlockImageEdit({ mode: null, index: null })}
            buttonText="REMOVE"
        />


    </>



}
export default MemoriesUpload;