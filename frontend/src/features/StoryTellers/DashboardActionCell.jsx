import React, { useState } from "react";
import PostcardAlert from "../PostcardAlert";
import PostcardModal from "../PostcardModal";
import CollectionForm from "../CollectionForm";
import {
    CommentsIcon,
    EditIcon,
    TrashIcon,
    ViewIcon
} from "../../styles/ChakraUI/icons";
import { deleteDBEntry } from "../../queries/strapiQueries";
import { apiNames } from "../../services/fetchApIDataSchema";
import { Link, useDisclosure } from "@chakra-ui/react";
import DrawerComments from "../Comments/DrawerComments";

const DashboardActionCell = ({ role, data, refetch, fetchSingleAlbum }) => {
    const [show, setShow] = useState({
        mode: false,
        message: `Are you sure you want to delete the Album- ${data?.name.toUpperCase()}?`
    });
    const [showEditAlbum, setShowEditAlbum] = useState(false);

    const handleOpenAlertBox = () => setShow({ ...show, mode: true });
    const handleCloseAlertBox = () => setShow({ ...show, mode: false });

    const handleDeleteAlbum = async () => {
        if (data?.news_article?.id)
            await deleteDBEntry(apiNames.newsArticles, data?.news_article?.id);
        await deleteDBEntry(apiNames.album, data?.id);
        refetch(null, true, false, false);
        handleCloseAlertBox();
    };

    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

    return (
        <>
            {
                <PostcardAlert
                    show={show}
                    handleAction={handleDeleteAlbum}
                    closeAlert={handleCloseAlertBox}
                    buttonText="DELETE"
                />
            }
            {
                <PostcardModal
                    size="3xl"
                    isShow={showEditAlbum}
                    headerText={"Edit"}
                    children={
                        <CollectionForm
                            onClose={() => {
                                setShowEditAlbum(false);
                            }}
                            mode="edit"
                            collection={data}
                            fetchSingleAlbum={fetchSingleAlbum}
                        ></CollectionForm>
                    }
                    handleClose={() => setShowEditAlbum(false)}
                />
            }
            {
                <DrawerComments
                    btnRef={btnRef}
                    isOpen={isOpen}
                    onClose={onClose}
                    albumName={data?.name}
                    newsArticleId={data?.news_article?.id}
                />
            }
            {role == "admin" && (
                <span>
                    <button
                        style={{ marginRight: "2px" }}
                        onClick={() => setShowEditAlbum(true)}
                    >
                        <EditIcon width="35" height="35" />
                    </button>
                    <button
                        style={{ marginLeft: "2px" }}
                        onClick={handleOpenAlertBox}
                    >
                        <TrashIcon width="35" height="35" />
                    </button>
                </span>
            )}
            {(role == "mentor" || role == "creator" || role == "eic") && (
                <span style={{ display: "flex", width: "100%" }}>
                    <Link
                        ref={btnRef}
                        href={`${window.location.origin}/postcard-pages/${data?.slug}`}
                        target="_blank"
                        style={{ marginRight: "2px" }}
                    >
                        <ViewIcon width="35" height="35" />
                    </Link>
                    <button
                        ref={btnRef}
                        onClick={onOpen}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "5px",
                            marginLeft: "2px"
                        }}
                    >
                        <CommentsIcon width="25" height="25" />
                    </button>
                </span>
            )}
        </>
    );
};

export default DashboardActionCell;
