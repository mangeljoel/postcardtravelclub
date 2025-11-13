import React, { useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import AppContext from "../AppContext";
import CreatePostcardPage from "../CreatePostcardPage";
import LoadingGif from "../../patterns/LoadingGif";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import { apiNames, populateNewsArticles } from "../../services/fetchApIDataSchema";

const StoryTellerPages = ({ article: initialArticle, album: initialAlbum }) => {
    const router = useRouter();
    const { profile } = useContext(AppContext);
    const [showActionButton, setShowActionButton] = useState(false);

    // State to manage article and album data
    const [article, setArticle] = useState(initialArticle);
    const [album, setAlbum] = useState(initialAlbum);
    const [isRefetching, setIsRefetching] = useState(false);

    // Update local state when props change
    useEffect(() => {
        setArticle(initialArticle);
        setAlbum(initialAlbum);
    }, [initialArticle, initialAlbum]);

    // Refetch function that handles both cases
    const refetchData = useCallback(async (id, type) => {
        setIsRefetching(true);
        try {
            const { id: routeParam } = router.query;

            // Determine if we should refetch article or album
            const shouldFetchArticle = article ? true : false;

            if (shouldFetchArticle) {
                // Case 1: News article exists - refetch the news article
                console.log("getting news article")
                // const result = await fetchPaginatedResults(
                //     apiNames.newsArticles,
                //     { album: { slug: routeParam } },
                //     populateNewsArticles
                // );

                // const updatedArticle = Array.isArray(result) ? result[0] : result;
                // if (updatedArticle) {
                //     setArticle(updatedArticle);
                //     setAlbum(updatedArticle.album);
                // }
            } else {
                console.log("getting album again")
                // Case 2: Album-only mode - refetch the album
                // const albumResult = await fetchPaginatedResults(
                //     apiNames.album,
                //     { slug: routeParam },
                //     {
                //         coverImage: { fields: ["url"] },
                //         country: true,
                //         region: true,
                //         postcards: {
                //             populate: {
                //                 coverImage: { fields: ["url"] },
                //                 tags: {
                //                     fields: ["name"],
                //                     populate: ["tag_group"],
                //                 },
                //             },
                //         },
                //     }
                // );

                // const updatedAlbum = Array.isArray(albumResult) ? albumResult[0] : albumResult;
                // if (updatedAlbum) {
                //     setAlbum(updatedAlbum);
                // }
            }
        } catch (error) {
            console.error("Error refetching data:", error);
        } finally {
            setIsRefetching(false);
        }
    }, [article, router.query]);

    // Prefer article, fallback to album
    let source = article ?? album;

    // Filter postcards based on user profile and isComplete field
    if (source?.postcards && profile) {
        const userType = profile?.user_type?.name;
        const isAdmin = ["SuperAdmin", "Admin", "EditorialAdmin", "EditorInChief"].includes(userType);

        if (!isAdmin) {
            // For non-admin users, filter to show only complete postcards (isComplete === true)
            source = {
                ...source,
                postcards: source.postcards.filter(postcard => postcard.isComplete === true)
            };
        }
        // For admin users, all postcards are shown (both complete and incomplete)
        // The rendering logic in CreatePostcardPage should handle showing them as DraftCard or Postcard
    }

    // Recompute showActionButton when profile or source change
    useEffect(() => {
        if (!profile || !source) {
            setShowActionButton(false);
            return;
        }

        const userType = profile?.user_type?.name;
        const isAdmin = ["SuperAdmin", "Admin", "EditorialAdmin", "EditorInChief"].includes(userType);

        const isCreatorEditable =
            userType === "StoryTeller" &&
            source?.creator?.id === profile?.id &&
            source?.status !== "published";

        setShowActionButton(isAdmin || isCreatorEditable);
    }, [profile, source]);

    // While Next is building fallback page or while source props haven't arrived, show loader.
    if (router.isFallback) return <LoadingGif />;

    // If source isn't yet available, show loader instead of "Content not found."
    // This prevents a brief flash of "Content not found" while props are still being hydrated.
    if (!source) return <LoadingGif />;

    // If you reach here, source is present — render the page.
    return (
        <>
            {isRefetching && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999
                }}>
                    <LoadingGif />
                </div>
            )}
            <CreatePostcardPage
                blogPost={article}   // may be null
                album={album}        // may be null (or filtered album if that was the source)
                showActionButton={showActionButton}
                refetchNewsArticle={refetchData}  // Pass the refetch function
            />
        </>
    );
};

export default StoryTellerPages;