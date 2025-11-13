import { Box } from "@chakra-ui/react";
import { useState, useContext, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Postcard from "../TravelExplore/TravelPostcardList/Postcard";
import DraftsCard from "../DraftsCard";
import AppContext from "../AppContext";
import InfiniteMasonry from "../../patterns/InfiniteMasonry";
import { uploadfile } from "../../services/utilities";
import FloatingAddButton from "../../patterns/AddButton";

const StayExperiences = ({
    postcards = [],
    loading = false,
    album,
    refetchNewsArticle,
    setAlbum,
    newsArticle,
    tagList = [],
    showActionButton,
    handleTagClick = () => { }
}) => {
    const { canCreatePostcard, profile } = useContext(AppContext);
    const [addingDraft, setAddingDraft] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState();
    const [uploadCounter, setUploadCounter] = useState(0);

    // Add state to track which postcards are in edit mode
    const [editingPostcards, setEditingPostcards] = useState(new Set());

    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    const [isButtonVisible, setIsButtonVisible] = useState(false);
    const lastScrollY = useRef(0);

    // Dropzone logic
    const onDrop = useCallback((acceptedFiles) => {
        setUploadCounter(-1);
        setFilesToUpload(acceptedFiles);
    }, []);

    useEffect(() => {
        if (filesToUpload && uploadCounter < 0) {
            let data = { user: profile.id, album: album.id };
            let count = 0;
            setUploadCounter(count);

            filesToUpload.forEach((file) => {
                uploadfile(file, null, "postcards", "coverImage", data, async () => {
                    count++;
                    setUploadCounter(count);
                    // Refetch based on whether newsArticle exists
                    if (newsArticle?.id) {
                        await refetchNewsArticle(newsArticle.id, "article");
                    } else {
                        await refetchNewsArticle(album.id, "album");
                    }
                    const element = document.getElementById("Postcard Experiences");
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                });
            });
            setFilesToUpload(null);
        }
    }, [filesToUpload, newsArticle, album, refetchNewsArticle, profile?.id]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false
    });

    useEffect(() => {
        const handleScroll = () => {
            const section = containerRef.current;
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;

            const currentScrollY = window.scrollY;
            const isScrollingUp = currentScrollY < lastScrollY.current;
            lastScrollY.current = currentScrollY;
            if (isInView) {
                setIsButtonVisible(true);
            } else {
                setIsButtonVisible(false);
            }
        };
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Helper function to handle setting edit state
    const setPostcardEditState = useCallback((postcardId, isEdit) => {
        setEditingPostcards(prev => {
            const newSet = new Set(prev);
            if (isEdit) {
                newSet.add(postcardId);
            } else {
                newSet.delete(postcardId);
            }
            return newSet;
        });
    }, []);

    // Helper function to handle refetch and clear edit state
    const handlePostcardRefetch = useCallback(async (postcardId) => {
        // Determine which type of refetch to perform
        if (newsArticle?.id) {
            await refetchNewsArticle(newsArticle.id, "article");
        } else {
            // Album-only mode - pass album id and type
            await refetchNewsArticle(album.id, "album");
        }

        // Clear edit state after successful update
        setEditingPostcards(prev => {
            const newSet = new Set(prev);
            newSet.delete(postcardId);
            return newSet;
        });
    }, [refetchNewsArticle, newsArticle, album]);

    return (
        <Box
            ref={containerRef}
            w="100%"
            px={{ base: "5%", lg: "10%" }}
            pb={{ base: "5%", lg: "10%" }}
            position="relative"
        >
            <InfiniteMasonry
                masonryItems={album?.postcards?.map((postcard, index) => {
                    if (!postcard) return null;
                    const hasRequiredFields = postcard?.name && postcard?.intro && postcard?.country;
                    const isComplete = postcard?.isComplete;
                    const canEdit = canCreatePostcard(newsArticle);

                    // Check if this postcard is currently being edited
                    const isCurrentlyInEditMode = editingPostcards.has(postcard.id);

                    // Set default isComplete to false for new postcards
                    if (isComplete === undefined) {
                        postcard.isComplete = false;
                    }

                    // Show DraftsCard if:
                    // 1. User can edit AND
                    // 2. (Postcard is incomplete OR user clicked edit OR missing required fields) AND
                    // 3. showActionButton is true
                    const shouldShowDraftsCard = canEdit && (!isComplete || isCurrentlyInEditMode);

                    if (shouldShowDraftsCard) {
                        return (
                            <DraftsCard
                                key={postcard?.id}
                                postcard={postcard}
                                isEdit={true}
                                story={album}
                                refetch={() => handlePostcardRefetch(postcard.id)}
                            />
                        );
                    }

                    // Show regular Postcard for completed postcards not in edit mode
                    return (
                        <Postcard
                            key={postcard?.id}
                            postcard={postcard}
                            from={"albumPage"}
                            setIsEdit={(value) => {
                                setPostcardEditState(postcard.id, value);
                                // let updatedPostcards = [...album.postcards];
                                // updatedPostcards[index] = { ...postcard, isEdit: value };
                                // setAlbum((prev) => ({ ...prev, postcards: updatedPostcards }));
                            }}
                            canEdit={canEdit}
                            refetch={async () => {
                                // Properly handle refetch based on context
                                if (newsArticle?.id) {
                                    await refetchNewsArticle(newsArticle.id, "article");
                                } else {
                                    await refetchNewsArticle(album.id, "album");
                                }
                            }}
                        />
                    );
                })}
                emptyState={null}
                dataLength={album?.postcards?.length || 0}
                loading={loading} // Pass the loading prop
            />
            <Box display="none">
                <input
                    {...getInputProps()}
                    ref={fileInputRef}
                />
            </Box>

            {showActionButton &&
                <FloatingAddButton
                    onClick={() => fileInputRef.current?.click()}
                    type="postcard"
                    isVisible={isButtonVisible}
                    containerRef={containerRef}
                />}
        </Box>
    );
};

export default StayExperiences;