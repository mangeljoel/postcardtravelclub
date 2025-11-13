import React, { useRef, useEffect, useState } from "react";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Textarea,
    Flex
} from "@chakra-ui/react";
import CommentCard from "./CommentCard";
import {
    createDBEntry,
    fetchPaginatedResults
} from "../../queries/strapiQueries";
import {
    apiNames,
    defaultSort,
    populateContentReviewData
} from "../../services/fetchApIDataSchema";

// const comments = [
//     {
//         name: "Deeksha",
//         content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
//     },
//     {
//         name: "Karen",
//         content:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
//     },
//     {
//         name: "Pooja",
//         content:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
//     },
//     {
//         name: "Karen",
//         content:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
//     },
//     {
//         name: "Karen",
//         content:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
//     }
// ];

const CommentsModal = ({
    profileId,
    isOpen,
    onClose,
    newsArticleId,
    handleSubmit,
    btnText
}) => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const ScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
    };

    useEffect(() => {
        if (isOpen)
            fetchPaginatedResults(
                apiNames.contentReview,
                {
                    news_article: newsArticleId
                },
                populateContentReviewData,
                defaultSort
            ).then((response) => {
                // console.log("response", response);
                if (Array.isArray(response)) setComments(response);
                else setComments([response]);
            });
    }, [isOpen]);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent
                    width="40vw"
                    height="70vh"
                    minWidth="500px"
                    minHeight="500px"
                    borderRadius={"20px"}
                    borderTopRadius={"25px"}
                    background={"background"}
                >
                    <ModalHeader
                        background={"primary_3"}
                        color={"white"}
                        borderTopRadius={"20px"}
                        margin={0}
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        position={"relative"}
                    >
                        <Text flex="1" textAlign="center">
                            Comments
                        </Text>
                        <ModalCloseButton position={"absolute"} top="auto" />
                    </ModalHeader>
                    <ModalBody>
                        <ul
                            style={{
                                listStyle: "none",
                                margin: 0,
                                padding: 0,
                                overflowY: "auto",
                                width: "100%",
                                display: "flex",
                                flexDirection: "column-reverse"
                            }}
                        >
                            {comments.map((comment, index) => (
                                <li key={index}>
                                    {" "}
                                    {/* Add space between items */}
                                    <CommentCard
                                        comment={comment}
                                        myComment={
                                            comment.user?.id === profileId
                                        }
                                    />
                                </li>
                            ))}
                        </ul>

                        <Flex
                            margin="15px"
                            justifyContent={"center"}
                            alignItems={"center"}
                            flexDirection={"column"}
                            gap="20px"
                        >
                            <Text color={"#0D99FF"}>
                                {`Are you sure you want to ${btnText} this?`}
                            </Text>

                            <Flex
                                flexDirection={"column"}
                                width={"100%"}
                                color={"#0D99FF"}
                            >
                                <Text marginBottom={"5px"}>
                                    Add comment, if any
                                </Text>
                                <Textarea
                                    border={"1px solid #EA6147"}
                                    background={"white"}
                                    height="120px"
                                    color="black"
                                    value={commentText}
                                    onChange={(e) =>
                                        setCommentText(e.target.value)
                                    }
                                />
                            </Flex>
                        </Flex>
                        <ScrollToBottom />
                    </ModalBody>

                    <ModalFooter justifyContent={"flex-end"}>
                        <Button
                            mx="1em"
                            variant="outline"
                            onClick={() => {
                                onClose();
                                setCommentText("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (commentText)
                                    createDBEntry(apiNames.contentReview, {
                                        news_article: newsArticleId,
                                        user: profileId,
                                        review: commentText
                                    });
                                setCommentText("");
                                handleSubmit();
                            }}
                        >
                            {btnText}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CommentsModal;
