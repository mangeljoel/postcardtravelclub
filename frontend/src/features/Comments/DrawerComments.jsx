import React, { useEffect, useRef, useState, useContext } from "react";
import {
    Input,
    Button,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Box,
    Text
} from "@chakra-ui/react";
import { EnterIcon } from "../../styles/ChakraUI/icons";
import CommentCard from "./CommentCard";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import {
    apiNames,
    defaultSort,
    populateContentReviewData
} from "../../services/fetchApIDataSchema";
import AppContext from "../AppContext";

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

const DrawerComments = ({
    albumName,
    btnRef,
    isOpen,
    onClose,
    newsArticleId
}) => {
    const [comments, setComments] = useState([]);
    const { profile } = useContext(AppContext);
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
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
            size={"sm"}
        >
            <DrawerOverlay />
            <DrawerContent background={"background"}>
                <DrawerHeader
                    background={"primary_3"}
                    color={"white"}
                >{`${albumName}'s comments`}</DrawerHeader>
                <DrawerCloseButton color={"white"} />

                <DrawerBody padding={0} height="80vh">
                    {comments.length > 0 ? (
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
                            {comments?.map((comment, index) => (
                                <li key={index}>
                                    {" "}
                                    {/* Add space between items */}
                                    <CommentCard
                                        comment={comment}
                                        myComment={
                                            comment.user.id == profile?.id
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                        >
                            <Text fontWeight={"bold"}>No Comments</Text>
                        </Box>
                    )}
                    <ScrollToBottom />
                </DrawerBody>

                <DrawerFooter padding={"10px"}>
                    <form
                        style={{
                            width: "100%",
                            display: "flex",
                            gap: "10px"
                        }}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        {/* <Input
                            style={{ background: "white" }}
                            placeholder="Type here..."
                        />
                        <Button
                            padding={"0"}
                            colorScheme="blue"
                            style={{ width: "40px", height: "40px" }}
                            type="submit"
                        >
                            <EnterIcon width="20" height={"20"} />
                        </Button> */}
                    </form>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default DrawerComments;
