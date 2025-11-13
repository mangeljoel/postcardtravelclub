import { LinkIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Flex,
    Input,
    Select,
    Text,
    Tooltip
} from "@chakra-ui/react";
import Link from "next/link";
import { useMemo } from "react";
import { IoMdImages } from "react-icons/io";

const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
};

const sortAlphabetically = (rowA, rowB, columnId, desc) => {
    // Get the two strings to compare
    const strA = rowA.values[columnId]
        ? rowA.values[columnId].toLowerCase()
        : "";
    const strB = rowB.values[columnId]
        ? rowB.values[columnId].toLowerCase()
        : "";

    // Check for non-truthy values to sort them to the end
    if (!rowA.values[columnId] && rowB.values[columnId]) {
        return 1; // Non-truthy A values go last
    } else if (!rowB.values[columnId] && rowA.values[columnId]) {
        return -1; // Non-truthy B values go last
    }

    // Compare strings alphabetically
    return strA.localeCompare(strB);
};

const sortByDate = (rowA, rowB, columnId, desc) => {
    // Convert the string date to a Date object
    const dateA = new Date(rowA.values[columnId]);
    const dateB = new Date(rowB.values[columnId]);
    // Compare the Date objects
    return dateA > dateB ? 1 : -1;
};

const SearchFilter = (rows, columnIds, filterValue) => {
    return rows.filter((row) => {
        const rowValue = row.values[columnIds[0]];
        return rowValue !== undefined
            ? String(rowValue)
                  .toLowerCase()
                  .startsWith(String(filterValue).toLowerCase())
            : true;
    });
};

const DefaultColumnFilter = ({
    column: { filterValue, preFilteredRows, setFilter, id }
}) => (
    <Input
        height="20px"
        marginTop={"3px"}
        // value={filterValue || ""}
        onChange={(e) => {
            setFilter(id, e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search...`}
    />
);

const DefaultSelectFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id }
}) => {
    const options = useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row) => {
            if (row.values[id]) options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
        <Select
            bg="cardBackground"
            height="20px"
            marginTop={"3px"}
            value={filterValue}
            fontSize={"15px"}
            onChange={(e) => {
                setFilter(id, e.target.value || undefined);
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </Select>
    );
};

const getColor = (role, row) => {
    if (role == "mentor") {
        if (row.news_article?.creator?.id == row.news_article?.assignto?.id) {
            if (
                row.news_article?.status == "submitted" ||
                row.news_article?.status == "draft"
            )
                return "#FFA629";
            else if (
                row.news_article?.status == "eic-rejected" ||
                row.news_article?.status == "editor-rejected"
            )
                return "#c4040a";
        } else {
            if (row.news_article?.status == "submitted") return "#FFA629";
        }
    } else if (role == "creator") {
        if (row.news_article?.status == "draft") {
            return "#FFA629";
        } else if (
            row.news_article?.status == "editor-rejected" ||
            row.news_article?.status == "eic-rejected"
        ) {
            return "#c4040a";
        }
    } else if (role == "eic") {
        if (row.news_article?.status == "eic-approved") {
            return "#00CA39";
        } else if (row.news_article?.status == "eic-rejected") {
            return "#c4040a";
        } else if (row.news_article?.status == "editor-approved") {
            return "#FFA629";
        }
    }
    return "";
};

export const AdminColumns = [
    {
        Header: "Date Created",
        accessor: "createdAt",
        Cell: ({ value }) => (
            <Text textAlign={"center"}>{formatDate(value)}</Text>
        ),
        sortType: sortByDate
    },
    {
        Header: "Date Modified",
        accessor: "updatedAt",
        Cell: ({ value }) => (
            <Text textAlign={"center"}>{formatDate(value)}</Text>
        ),
        sortType: sortByDate
    },
    {
        Header: "Stay Name",
        accessor: "name",
        sortType: sortAlphabetically,
        canFilter: true,
        Cell: ({ row, value }) =>
            value ? (
                <Flex justifyContent="center" alignItems="center" width="100%">
                    <Tooltip label={value} hasArrow>
                        <Box textAlign="center" maxWidth="100%">
                            <Text
                                textOverflow="ellipsis"
                                overflow="hidden"
                                noOfLines={2}
                                whiteSpace="normal"
                            >
                                {value}
                            </Text>
                        </Box>
                    </Tooltip>
                    {row.original?.news_article?.status == "draft" && (
                        <Button
                            padding={0}
                            height="20px"
                            marginLeft={"5px"}
                            fontSize={"x-small"}
                        >
                            New
                        </Button>
                    )}
                </Flex>
            ) : (
                "Not Available"
            ),
        Filter: DefaultColumnFilter
    },
    {
        Header: "Stay Web Link",
        accessor: "website",
        Cell: ({ value }) =>
            value ? (
                <Box textAlign={"center"}>
                    <Link
                        href={value}
                        style={{ fontWeight: 500, textDecoration: "underline" }}
                        target="_blank"
                    >
                        <LinkIcon width="20px" height="20px" />
                    </Link>
                </Box>
            ) : (
                <Text textAlign={"center"}>Not Available</Text>
            ),
        disableSortBy: true
    },
    {
        Header: "Media Kit",
        accessor: "media_kit",
        Cell: ({ value, row }) =>
            value ? (
                <Box textAlign={"center"}>
                    <Link
                        href={value}
                        style={{ fontWeight: 500, textDecoration: "underline" }}
                        target="_blank"
                    >
                        <Text
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%" // Ensure the Text component has a height to center vertically
                            }}
                        >
                            <IoMdImages
                                style={{ width: "25px", height: "25px" }}
                                size={"24px"}
                            />
                        </Text>
                    </Link>
                </Box>
            ) : (
                <Text textAlign={"center"}>Not Available</Text>
            ),
        disableSortBy: true
    },
    {
        Header: "Writer Assigned",
        accessor: "news_article.assignto.username",
        Cell: ({ row, value }) =>
            // row.original.news_article?.assignto?.username ?? "Not Available",
            value ? (
                <Tooltip label={value} hasArrow>
                    <Box textAlign="center" maxWidth="100%">
                        <Text
                            textOverflow="ellipsis"
                            overflow="hidden"
                            noOfLines={2}
                            whiteSpace="normal"
                        >
                            {value}
                        </Text>
                    </Box>
                </Tooltip>
            ) : (
                <Text textAlign={"center"}>Not Available</Text>
            ),
        // disableSortBy: true,
        sortType: sortAlphabetically,
        canFilter: true,
        Filter: DefaultSelectFilter
    },
    {
        Header: "Status",
        accessor: "news_article.status",
        Cell: ({ row, value }) =>
            // row.original.news_article?.status ?? "Not Available",
            value ? (
                <Text textAlign={"center"}>{value}</Text>
            ) : (
                <Text textAlign={"center"}>Not Available</Text>
            ),
        // disableSortBy: true,
        sortType: sortAlphabetically,
        canFilter: true,
        Filter: DefaultSelectFilter
    },
    {
        Header: "Actions",
        accessor: "actions", //not used but kept for understanding
        disableSortBy: true,
        Cell: ({ value }) => value
    }
];

export const MentorColumns = [
    {
        Header: "Date Created",
        accessor: "createdAt",
        Cell: ({ row, value }) => (
            <Text
                color={`${getColor("mentor", row.original)}!important`}
                textAlign={"center"}
            >
                {formatDate(value)}
            </Text>
        ),
        sortType: sortByDate
    },
    {
        Header: "Date Modified",
        accessor: "updatedAt",
        Cell: ({ row, value }) => (
            <Text
                color={`${getColor("mentor", row.original)}!important`}
                textAlign={"center"}
            >
                {formatDate(value)}
            </Text>
        ),
        sortType: sortByDate
    },
    {
        Header: "Stay Name",
        accessor: "name",
        sortType: sortAlphabetically,
        canFilter: true,
        Cell: ({ row, value }) =>
            value ? (
                <Flex justifyContent="center" alignItems="center" width="100%">
                    <Tooltip label={value} hasArrow>
                        <Box textAlign="center" maxWidth="100%">
                            <Text
                                textOverflow="ellipsis"
                                overflow="hidden"
                                noOfLines={2}
                                color={`${getColor("mentor", row.original)}!important`}
                                whiteSpace="normal"
                            >
                                {value}
                            </Text>
                        </Box>
                    </Tooltip>
                    {!row.original?.news_article?.creator?.id && (
                        <Button
                            padding={0}
                            height="20px"
                            marginLeft={"5px"}
                            fontSize={"x-small"}
                        >
                            New
                        </Button>
                    )}
                </Flex>
            ) : (
                "Not Available"
            ),
        Filter: DefaultColumnFilter
    },
    {
        Header: "Stay Web Link",
        accessor: "website",
        Cell: ({ value, row }) =>
            value ? (
                <Box textAlign={"center"}>
                    <Link
                        href={value}
                        style={{
                            fontWeight: 500,
                            textDecoration: "underline",
                            color: `${getColor("mentor", row.original)}`
                        }}
                        target="_blank"
                    >
                        <LinkIcon width="20px" height="20px" />
                    </Link>
                </Box>
            ) : (
                <Text
                    color={`${getColor("mentor", row.original)}!important`}
                    textAlign={"center"}
                >
                    Not Available
                </Text>
            ),
        disableSortBy: true
    },
    {
        Header: "Media Kit",
        accessor: "media_kit",
        Cell: ({ value, row }) =>
            value ? (
                <Box textAlign={"center"}>
                    <Link
                        href={value}
                        style={{
                            fontWeight: 500,
                            textDecoration: "underline",
                            color: `${getColor("mentor", row.original)}`
                        }}
                        target="_blank"
                    >
                        <Text
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%" // Ensure the Text component has a height to center vertically
                            }}
                        >
                            <IoMdImages
                                style={{ width: "25px", height: "25px" }}
                                size={"24px"}
                            />
                        </Text>
                    </Link>
                </Box>
            ) : (
                <Text
                    color={`${getColor("mentor", row.original)}!important`}
                    textAlign={"center"}
                >
                    Not Available
                </Text>
            ),
        disableSortBy: true
    },
    {
        Header: "StoryTeller",
        accessor: "news_article.creator.username",
        Cell: ({ row, value }) =>
            value ? (
                <Tooltip label={value} hasArrow>
                    <Box textAlign="center" maxWidth="100%">
                        <Text
                            textOverflow="ellipsis"
                            overflow="hidden"
                            noOfLines={2}
                            whiteSpace="normal"
                            color={`${getColor("mentor", row.original)}!important`}
                        >
                            {value}
                        </Text>
                    </Box>
                </Tooltip>
            ) : (
                <Text
                    color={`${getColor("mentor", row.original)}!important`}
                    textAlign={"center"}
                >
                    Not Available
                </Text>
            ),
        sortType: sortAlphabetically,
        canFilter: true,
        Filter: DefaultSelectFilter
    },
    {
        Header: "Status",
        accessor: "news_article.status",
        Cell: ({ row, value }) =>
            value ? (
                <Text
                    color={`${getColor("mentor", row.original)}!important`}
                    textAlign={"center"}
                >
                    {value}
                </Text>
            ) : (
                <Text
                    color={`${getColor("mentor", row.original)}!important`}
                    textAlign={"center"}
                >
                    Not Available
                </Text>
            ),
        // disableSortBy: true,
        sortType: sortAlphabetically,
        canFilter: true,
        Filter: DefaultSelectFilter
    },
    {
        Header: "Actions",
        accessor: "actions", //not used but kept for understanding
        disableSortBy: true,
        Cell: ({ value }) => value
    }
];

export const EicColumns = [
    {
        Header: "Date Created",
        accessor: "createdAt",
        Cell: ({ row, value }) => (
            <Text
                color={`${getColor("eic", row.original)}!important`}
                textAlign={"center"}
            >
                {formatDate(value)}
            </Text>
        ),
        sortType: sortByDate
    },
    {
        Header: "Date Modified",
        accessor: "updatedAt",
        Cell: ({ row, value }) => (
            <Text
                color={`${getColor("eic", row.original)}!important`}
                textAlign={"center"}
            >
                {formatDate(value)}
            </Text>
        ),
        sortType: sortByDate
    },
    {
        Header: "Stay Name",
        accessor: "name",
        sortType: sortAlphabetically,
        canFilter: true,
        Cell: ({ row, value }) =>
            value ? (
                <Flex justifyContent="center" alignItems="center" width="100%">
                    <Tooltip label={value} hasArrow>
                        <Box textAlign="center" maxWidth="100%">
                            <Text
                                textOverflow="ellipsis"
                                overflow="hidden"
                                noOfLines={2}
                                color={`${getColor("eic", row.original)}!important`}
                                whiteSpace="normal"
                            >
                                {value}
                            </Text>
                        </Box>
                    </Tooltip>
                </Flex>
            ) : (
                "Not Available"
            ),
        Filter: DefaultColumnFilter
    },
    {
        Header: "Stay Web Link",
        accessor: "website",
        Cell: ({ row, value }) =>
            value ? (
                <Box textAlign={"center"}>
                    <Link
                        href={value}
                        style={{
                            fontWeight: 500,
                            textDecoration: "underline",
                            color: `${getColor("eic", row.original)}`
                        }}
                        target="_blank"
                    >
                        <LinkIcon width="20px" height="20px" />
                    </Link>
                </Box>
            ) : (
                <Text
                    color={`${getColor("eic", row.original)}!important`}
                    textAlign={"center"}
                >
                    Not Available
                </Text>
            ),
        disableSortBy: true
    },
    {
        Header: "Media Kit",
        accessor: "media_kit",
        Cell: ({ row, value }) =>
            value ? (
                <Box textAlign={"center"}>
                    <Link
                        href={value}
                        style={{
                            fontWeight: 500,
                            textDecoration: "underline",
                            color: `${getColor("eic", row.original)}`
                        }}
                        target="_blank"
                    >
                        <Text
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%" // Ensure the Text component has a height to center vertically
                            }}
                        >
                            <IoMdImages
                                style={{ width: "25px", height: "25px" }}
                                size={"24px"}
                            />
                        </Text>
                    </Link>
                </Box>
            ) : (
                <Text
                    color={`${getColor("eic", row.original)}!important`}
                    textAlign={"center"}
                >
                    Not Available
                </Text>
            ),
        disableSortBy: true
    },
    {
        Header: "Mentor",
        accessor: "news_article.assignto.username",
        Cell: ({ row, value }) =>
            value ? (
                <Tooltip label={value} hasArrow>
                    <Box textAlign="center" maxWidth="100%">
                        <Text
                            textOverflow="ellipsis"
                            overflow="hidden"
                            noOfLines={2}
                            whiteSpace="normal"
                            color={`${getColor("eic", row.original)}!important`}
                        >
                            {value}
                        </Text>
                    </Box>
                </Tooltip>
            ) : (
                <Text
                    color={`${getColor("eic", row.original)}!important`}
                    textAlign={"center"}
                >
                    Not Available
                </Text>
            ),
        sortType: sortAlphabetically,
        canFilter: true,
        Filter: DefaultSelectFilter
    },
    {
        Header: "Status",
        accessor: "news_article.status",
        Cell: ({ row, value }) =>
            value ? (
                <Text
                    color={`${getColor("eic", row.original)}!important`}
                    textAlign={"center"}
                >
                    {value}
                </Text>
            ) : (
                <Text
                    color={`${getColor("eic", row.original)}!important`}
                    textAlign={"center"}
                >
                    Not Available
                </Text>
            ),
        // disableSortBy: true,
        sortType: sortAlphabetically,
        canFilter: true,
        Filter: DefaultSelectFilter
    },
    {
        Header: "Actions",
        accessor: "actions", //not used but kept for understanding
        disableSortBy: true,
        Cell: ({ value }) => value
    }
];

export const StoryTellerColumns = [
    {
        Header: "Date Created",
        accessor: "createdAt",
        Cell: ({ row, value }) => (
            <Text
                color={`${getColor("creator", row.original)}!important`}
                textAlign={"center"}
            >
                {formatDate(value)}
            </Text>
        ),
        sortType: sortByDate
    },
    {
        Header: "Date Modified",
        accessor: "updatedAt",
        Cell: ({ row, value }) => (
            <Text
                color={`${getColor("creator", row.original)}!important`}
                textAlign={"center"}
            >
                {formatDate(value)}
            </Text>
        ),
        sortType: sortByDate
    },
    {
        Header: "Stay Name",
        accessor: "name",
        sortType: sortAlphabetically,
        canFilter: true,
        Cell: ({ row, value }) =>
            value ? (
                <Flex justifyContent="center" alignItems="center" width="100%">
                    <Tooltip label={value} hasArrow>
                        <Box textAlign="center" maxWidth="100%">
                            <Text
                                textOverflow="ellipsis"
                                overflow="hidden"
                                noOfLines={2}
                                color={`${getColor("creator", row.original)}!important`}
                                whiteSpace="normal"
                            >
                                {value}
                            </Text>
                        </Box>
                    </Tooltip>
                </Flex>
            ) : (
                "Not Available"
            ),
        Filter: DefaultColumnFilter
    },
    {
        Header: "Stay Web Link",
        accessor: "website",
        Cell: ({ row, value }) =>
            value ? (
                <Box textAlign={"center"}>
                    <Link
                        href={value}
                        style={{
                            fontWeight: 500,
                            textDecoration: "underline",
                            color: `${getColor("creator", row.original)}`
                        }}
                        target="_blank"
                    >
                        <LinkIcon width="20px" height="20px" />
                    </Link>
                </Box>
            ) : (
                <Text
                    color={`${getColor("creator", row.original)}!important`}
                    textAlign={"center"}
                >
                    {" "}
                    Not Available
                </Text>
            ),
        disableSortBy: true
    },
    {
        Header: "Media Kit",
        accessor: "media_kit",
        Cell: ({ row, value }) =>
            value ? (
                <Box textAlign={"center"}>
                    <Link
                        href={value}
                        style={{
                            fontWeight: 500,
                            textDecoration: "underline",
                            color: `${getColor("creator", row.original)}`
                        }}
                        target="_blank"
                    >
                        <Text
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%" // Ensure the Text component has a height to center vertically
                            }}
                        >
                            <IoMdImages
                                style={{ width: "25px", height: "25px" }}
                                size={"24px"}
                            />
                        </Text>
                    </Link>
                </Box>
            ) : (
                <Text
                    color={`${getColor("creator", row.original)}!important`}
                    textAlign={"center"}
                >
                    Not Available
                </Text>
            ),
        disableSortBy: true
    },
    {
        Header: "Status",
        accessor: "news_article.status",
        Cell: ({ row, value }) =>
            value ? (
                <Text
                    color={`${getColor("creator", row.original)}!important`}
                    textAlign={"center"}
                >
                    {value}
                </Text>
            ) : (
                <Text
                    color={`${getColor("creator", row.original)}!important`}
                    textAlign={"center"}
                >
                    Not Available
                </Text>
            ),
        // disableSortBy: true,
        sortType: sortAlphabetically,
        canFilter: true,
        Filter: DefaultSelectFilter
    },
    {
        Header: "Actions",
        accessor: "actions", //not used but kept for understanding
        disableSortBy: true,
        Cell: ({ value }) => value
    }
];
