import React from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button
} from "@chakra-ui/react";

const PostcardAlert = ({ show, handleAction, closeAlert, buttonText }) => {
    const cancelRef = React.useRef();

    return (
        <>
            <AlertDialog
                isOpen={show.mode}
                leastDestructiveRef={cancelRef}
                onClose={closeAlert}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent margin={"auto"}>
                        <AlertDialogBody fontFamily={"lora"} fontStyle={"italic"} fontSize={["3.62vw", "1.18vw"]} lineHeight={["4vw", "2vw"]}>{show.message}</AlertDialogBody>

                        <AlertDialogFooter>
                            <Button mr="5%" onClick={handleAction}>
                                {/* {isSuccess ? "OK" : "DELETE"} */}
                                {buttonText}
                            </Button>
                            {closeAlert && (
                                <Button onClick={closeAlert}> CANCEL</Button>
                            )}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default PostcardAlert;
