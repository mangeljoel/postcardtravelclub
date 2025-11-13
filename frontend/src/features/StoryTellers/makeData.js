import { Link } from "@chakra-ui/react";
import { EditIcon, TrashIcon } from "../../styles/ChakraUI/icons";
import DashboardActionCell from "./DashboardActionCell.jsx";

const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
};

export const makeData = (role, data) => {
    if (role == "admin") return makeAdminData(data);
    return null;
};

const makeAdminData = (data) => {
    // console.log(data[0]);
    return data?.map((item, index) => {
        return {
            index: index + 1,
            albumId: item.id,
            createdAt: formatDate(item?.createdAt),
            updatedAt: formatDate(item?.updatedAt),
            albumName: item?.name,
            website: item?.website ? (
                <Link
                    href={item?.website}
                    style={{ fontWeight: 500, textDecoration: "underline" }}
                    target="_blank"
                >
                    Link
                </Link>
            ) : (
                "Not Available"
            ),
            mediaKit: item?.media_kit ? (
                <Link
                    href={item.media_kit}
                    style={{ fontWeight: 500, textDecoration: "underline" }}
                    target="_blank"
                >
                    Media Kit
                </Link>
            ) : (
                "Not Available"
            ),
            assignto: item?.news_article?.assignto?.username || "Not Assigned",
            status: item?.news_article?.status || "Not Available",
            originalData: item
        };
    });
};
