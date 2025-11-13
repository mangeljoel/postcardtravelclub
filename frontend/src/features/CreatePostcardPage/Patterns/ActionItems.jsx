import { Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CommentsModal from "../../Comments/CommentsModal";
import { updateDBValue } from "../../../queries/strapiQueries";
import { apiNames } from "../../../services/fetchApIDataSchema";

const ActionItems = ({
    profile,
    newsArticle,
    status,
    formikProps,
    editMode,
    setEditMode,
    onApprovalSubmit,

    isSubmitting,

    isCreator,
    refetchNewsArticle,
    actionItemHandler,
    setActionItemHandler,
    setShouldShowCommentBox
}) => {
    const isMentor = profile?.user_type?.name === "EditorialAdmin";
    const isEic = profile?.user_type?.name === "EditorInChief";
    const isAdminOrSuperAdmin = profile?.user_type?.name === "Admin" || profile?.user_type?.name === "SuperAdmin";
    const onClose = () =>
        setActionItemHandler((prevValue) => {
            return { ...prevValue, showCommentBox: false };
        });
    // console.log(isCreator, isMentor, isEic, profile?.user_type?.name);
    function shouldShowEditButton() {
        if (isAdminOrSuperAdmin || isCreator || isMentor || isEic) {
            if (!editMode) {
                return true;
            }
        }
        return false;
    }
    function shouldShowSaveButton() {
        if (isAdminOrSuperAdmin || isCreator || isMentor || isEic) {
            if (editMode) {
                return true;
            }
        }
        return false;
    }
    function shouldShowSubmitButton() {
        if (isCreator) {
            if (["draft", "editor-rejected", "eic-rejected"].includes(status)) {
                return true;
            }
        }
        return false;
    }
    function shouldShowRevokeButton() {
        if (isCreator) {
            if ("submitted" == status && !editMode) {
                return true;
            }
        }
        return false;
    }
    function shouldShowApproveButton() {
        if (isMentor) {
            if (
                !editMode &&
                ["submitted", "editor-rejected"].includes(status)
            ) {
                return true;
            }
        }
        if (isEic) {
            if (
                !editMode &&
                ["editor-approved", "eic-rejected"].includes(status)
            ) {
                return true;
            }
        }
        return false;
    }
    function shouldShowRejectButton() {
        if (isMentor) {
            if (
                !editMode &&
                ["submitted", "editor-approved"].includes(status)
            ) {
                return true;
            }
        }
        if (isEic) {
            if (
                !editMode &&
                ["editor-approved", "eic-approved"].includes(status)
            ) {
                return true;
            }
        }
        return false;
    }
    function shouldShowPublishButton() {
        if (isEic) {
            if (!editMode && status == "eic-approved") {
                return true;
            }
        }
        return false;
    }
    function shouldShowUnpublishButton() {
        if (isEic) {
            if (!editMode && status == "published") {
                return true;
            }
        }
        return false;
    }
    const [showEditButton, setShowEditButton] = useState(false);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showRevokeButton, setShowRevokeButton] = useState(false);
    const [showApproveButton, setShowApproveButton] = useState(false);
    const [showRejectButton, setShowRejectButton] = useState(false);
    const [showPublishButton, setShowPublishButton] = useState(false);
    const [showUnpublishButton, setShowUnpublishButton] = useState(false);

    useEffect(() => {
        setShowEditButton(shouldShowEditButton());
        setShowSaveButton(shouldShowSaveButton());
        setShowSubmitButton(shouldShowSubmitButton());
        setShowRevokeButton(shouldShowRevokeButton());
        setShowApproveButton(shouldShowApproveButton());
        setShowRejectButton(shouldShowRejectButton());
        setShowPublishButton(shouldShowPublishButton());
        setShowUnpublishButton(shouldShowUnpublishButton());
        // console.log("status", status);
    }, [newsArticle, editMode, status]);

    return (
        <Box
            w="50%"
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
        >
            {
                <CommentsModal
                    profileId={profile?.id}
                    isOpen={actionItemHandler.showCommentBox}
                    onClose={onClose}
                    newsArticleId={newsArticle?.id}
                    statusToUpdate={actionItemHandler.statusToUpdate}
                    btnText={actionItemHandler.btnText}
                    handleSubmit={() => {
                        setEditMode(false);
                        updateDBValue(apiNames.newsArticles, newsArticle?.id, {
                            status: actionItemHandler.statusToUpdate
                        }).then((res) => {
                            if (
                                actionItemHandler.statusToUpdate == "published"
                            ) {
                                strapi.find(
                                    `/news-articles/articlepublish?articlId=${newsArticle.id}`
                                );
                            }
                            refetchNewsArticle();
                        });
                        onClose();
                    }}
                />
            }
            {showEditButton && (
                <Button
                    my="1em"
                    variant="outline"
                    onClick={() => {
                        setEditMode(true);
                    }}
                >
                    Edit
                </Button>
            )}
            {showSaveButton && (
                <Button
                    my="1em"
                    variant="outline"
                    isDisabled={isSubmitting || !formikProps.isValid}
                    onClick={() => {
                        setShouldShowCommentBox(false);
                        formikProps.handleSubmit();
                        setEditMode(false);
                    }}
                >
                    Save
                </Button>
            )}
            {showSubmitButton && (
                <Button
                    my="1em"
                    isDisabled={isSubmitting || !formikProps.isValid}
                    onClick={() => {
                        setShouldShowCommentBox(true);
                        formikProps.handleSubmit();
                        setActionItemHandler((prevValue) => {
                            return {
                                ...prevValue,
                                statusToUpdate: "submitted",
                                btnText: "Submit"
                            };
                        });
                    }}
                >
                    Submit
                </Button>
            )}
            {showRevokeButton && (
                <Button
                    my="1em"
                    onClick={() => {
                        setActionItemHandler((prevValue) => {
                            return {
                                ...prevValue,
                                showCommentBox: true,
                                statusToUpdate: "draft",
                                btnText: "Revoke"
                            };
                        });
                    }}
                >
                    Revoke
                </Button>
            )}
            {showApproveButton && (
                <Button
                    my="1em"
                    onClick={() => {
                        setActionItemHandler((prevValue) => {
                            return {
                                ...prevValue,
                                showCommentBox: true,
                                statusToUpdate:
                                    profile.user_type.name == "EditorialAdmin"
                                        ? "editor-approved"
                                        : profile.user_type.name ==
                                        "EditorInChief" && "eic-approved",
                                btnText: "Approve"
                            };
                        });
                    }}
                >
                    Approve
                </Button>
            )}
            {showRejectButton && (
                <Button
                    my="1em"
                    onClick={() => {
                        setActionItemHandler((prevValue) => {
                            return {
                                ...prevValue,
                                showCommentBox: true,
                                statusToUpdate:
                                    profile.user_type.name == "EditorialAdmin"
                                        ? "editor-rejected"
                                        : profile.user_type.name ==
                                        "EditorInChief" && "eic-rejected",
                                btnText: "Reject"
                            };
                        });
                    }}
                >
                    Reject
                </Button>
            )}
            {showPublishButton && (
                <Button
                    my="1em"
                    onClick={() => {
                        setActionItemHandler((prevValue) => {
                            return {
                                ...prevValue,
                                showCommentBox: true,
                                statusToUpdate: "published",
                                btnText: "Publish"
                            };
                        });
                    }}
                >
                    Publish
                </Button>
            )}
            {showUnpublishButton && (
                <Button
                    my="1em"
                    onClick={() => {
                        setActionItemHandler((prevValue) => {
                            return {
                                ...prevValue,
                                showCommentBox: true,
                                statusToUpdate: "eic-approved",
                                btnText: "Unpublish"
                            };
                        });
                    }}
                >
                    Unpublish
                </Button>
            )}
        </Box>
        // isCreator &&
        // (status === "draft" ||
        //     status === "editor-rejected" ||
        //     status === "eic-rejected") && (
        //     <Box
        //         w="50%"
        //         display={"flex"}
        //         flexDirection={"column"}
        //         justifyContent={"flex-end"}
        //     >
        //         {editMode ? (
        //             <Button
        //                 variant="outline"
        //                 isDisabled={isSubmitting}
        //                 onClick={formikProps.handleSubmit}
        //             >
        //                 Save
        //             </Button>
        //         ) : (
        //             <Button
        //                 my="1em"
        //                 variant="outline"
        //                 onClick={() => setEditMode()}
        //             >
        //                 Edit
        //             </Button>
        //         )}
        //         <Button my="1em" isDisabled={isSubmitting}>
        //             {status === "draft" ||
        //             status === "editor-rejected" ||
        //             status === "eic-rejected"
        //                 ? "Submit"
        //                 : "Revoke"}
        //         </Button>
        //     </Box>
        // )
    );
};
export default ActionItems;
