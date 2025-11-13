import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const CommentCard = ({ comment, myComment }) => {
    const date = new Date(comment?.updatedAt);
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const options = {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    };
    const timeOptions = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    };
    return (
        <Flex
            width="100%"
            justifyContent={`${myComment ? "flex-end" : "flex-start"}`}
        >
            {myComment && (
                <Box
                    margin="10px"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end"
                    }}
                >
                    <Text fontSize={"small"}>
                        {date.toLocaleString(locale, options)}
                    </Text>
                </Box>
            )}
            <Box
                style={{
                    maxWidth: "60%",
                    background: `${myComment ? "#EA6147" : "white"}`,
                    margin: "10px",
                    borderRadius: "10px",
                    padding: "10px",
                    textAlign: `${myComment ? "right" : "left"}`,
                    position: "relative"
                }}
            >
                {/* <Text
                    style={{
                        position: "absolute",
                        top: 0,
                        right: "5px",
                        fontSize: "10px"
                    }}
                >
                    {date.toLocaleString(locale, timeOptions)}
                </Text> */}
                <Text style={{ color: `${myComment ? "white" : "primary_3"}` }}>
                    {comment?.user?.fullName}
                </Text>
                <Text>{comment?.review}</Text>
            </Box>
            {!myComment && (
                <Box
                    margin="10px"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end"
                    }}
                >
                    <Text fontSize={"small"}>
                        {date.toLocaleString(locale, options)}
                    </Text>
                </Box>
            )}
        </Flex>
    );
};

export default CommentCard;
