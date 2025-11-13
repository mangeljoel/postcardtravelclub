import { Link } from "@chakra-ui/react";
export const makeData = (tableData) => {
    tableData = tableData.map((record) => {
        return {
            ...statusTableData(record)
        };
    });
    return tableData;
};
const statusTableData = (data) => {
    return {
        fullName: data.fullName,
        email: data.email,
        noOfpostcards: data.postcardsCreated,
        albumName: data.albums?.length > 0 ? data.albums[0]?.name : "-",
        albumStatus:
            data.albums?.length > 0 && data.albums[0]?.on_boarding
                ? data.albums[0]?.on_boarding.state
                : "-",
        albumPage:
            data.albums?.length > 0
                ? "https://postcard.travel/" + data.albums[0]?.slug
                : "-",
        userType: data.user_type ? data.user_type.name : "-"
    };
};
