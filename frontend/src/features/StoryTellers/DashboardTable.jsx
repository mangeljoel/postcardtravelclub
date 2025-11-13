import React, { useEffect, useState, useMemo } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Flex,
    Select,
    Box,
    Input,
    Text,
    Button,
    Spinner
} from "@chakra-ui/react";
import PostcardModal from "../PostcardModal";
import PostcardAlert from "../PostcardAlert";
import CollectionForm from "../CollectionForm";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    Search2Icon
} from "@chakra-ui/icons";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { apiNames, populateAlbumData } from "../../services/fetchApIDataSchema";
import {
    AdminColumns,
    EicColumns,
    MentorColumns,
    StoryTellerColumns
} from "./TableHeaders";
import {
    fetchPaginatedResults,
    getTotalRecords,
    updateDBValue
} from "../../queries/strapiQueries";
import { makeData } from "./makeData";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import DashboardActionCell from "./DashboardActionCell";
import LoadingGif from "../../patterns/LoadingGif";
import ReactPaginate from "react-paginate";

const DashboardTable = ({ role, profile }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateAlbum, setShowCreateAlbum] = useState(false);
    const [tableConfig, setTableConfig] = useState({
        apiName: null,
        columns: null
    });
    const [sort, setSort] = useState("updatedAt:DESC");

    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    // console.log(profile);

    const [storyTellerList, setStoryTellerList] = useState([]);
    useEffect(() => {
        if (role == "mentor") {
            fetchPaginatedResults(
                apiNames.user,
                {
                    user_type: {
                        $or: [
                            { name: "StoryTeller" },
                            { name: "EditorialAdmin" }
                        ]
                    }
                },
                {}
            ).then((response) =>
                setStoryTellerList(
                    Array.isArray(response) ? response : [response]
                )
            );
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        if (role == "admin") {
            setTableConfig({
                apiName: apiNames.album,
                columns: AdminColumns
            });
        } else if (role == "eic") {
            setTableConfig({
                apiName: apiNames.album,
                columns: EicColumns
            });
        } else if (role == "mentor") {
            setTableConfig({
                apiName: apiNames.album,
                columns: MentorColumns
            });
        } else {
            setTableConfig({
                apiName: apiNames.album,
                columns: StoryTellerColumns
            });
        }
    }, []);

    useEffect(() => {
        fetchTableData();
    }, [tableConfig, currentPage]);

    function assignValueByDotNotation(dotNotationKey, value) {
        const keys = dotNotationKey.split(".");
        const result = {};
        let current = result;
        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                current[key] = value;
            } else {
                current[key] = current[key] || {};
                current = current[key];
            }
        });
        return result;
    }

    const fetchTableData = (
        sortCondition = sort,
        useFilters = true,
        showLoader = true,
        gotoPageZero = false
    ) => {
        if (showLoader) setLoading(true);
        if (tableConfig.apiName) {
            let filtersApplied = {};
            if (selectedColumn && useFilters)
                filtersApplied = assignValueByDotNotation(selectedColumn, {
                    $containsi: filterInput
                });
            let userFilter = {};
            if (role == "mentor") {
                userFilter = assignValueByDotNotation(
                    "assignto.id",
                    profile.id
                );
            } else if (role == "creator") {
                userFilter = assignValueByDotNotation("creator.id", profile.id);
            }
            if (filtersApplied.hasOwnProperty("news_article")) {
                filtersApplied = {
                    //filter only those records which are assigned to this logged in user who is a mentor
                    ...filtersApplied,
                    news_article: {
                        ...filtersApplied.news_article,
                        ...userFilter
                    }
                };
            } else {
                filtersApplied = {
                    //filter only those records which are assigned to this logged in user who is a mentor
                    ...filtersApplied,
                    news_article: userFilter
                };
            }
            // console.log("filtersApplied", {
            //     name: { $notNull: true },
            //     ...filtersApplied
            // });
            fetchPaginatedResults(
                apiNames.album,
                {
                    name: { $notNull: true },
                    ...filtersApplied
                },
                populateAlbumData,
                sortCondition || sort,
                gotoPageZero ? 0 : currentPage * itemsPerPage,
                itemsPerPage
            )?.then((response) => {
                // console.log("response", response);
                if (Array.isArray(response)) setData(response);
                else setData([response]);
                fetchPageCount(filtersApplied);
                if (gotoPageZero) setCurrentPage(0);
                if (showLoader) setLoading(false);
            });
        }
    };

    const fetchPageCount = (filters) => {
        if (tableConfig.apiName) {
            getTotalRecords(apiNames.album, {
                name: { $notNull: true },
                ...filters
            })?.then((response) => {
                setPageCount(Math.ceil(response / itemsPerPage));
            });
        }
    };

    const fetchSingleAlbum = (albumId, mode) => {
        // setLoading(true);
        fetchPaginatedResults(
            apiNames.album,
            { name: { $notNull: true }, id: albumId },
            populateAlbumData
        ).then((response) => {
            // console.log("newAlbum", response);
            if (mode == "create") {
                // setData((prevData) => [response, ...prevData]);
                fetchTableData(null, false, false, true);
            } else {
                fetchTableData(null, true, false, true);
            }
            // setLoading(false);
        });
    };

    const handlePageClick = (event) => {
        const newPage = event.selected;
        setCurrentPage(newPage);
        window.scroll({ top: 0, behavior: "smooth" });
    };

    // useEffect(() => console.log(data), [data])
    const memoizedData = useMemo(() => data || [], [data]);
    const memoizedColumns = useMemo(
        () => tableConfig.columns || [],
        [tableConfig]
    );

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null
    });

    // Step 2: Custom Sort Handler
    const customSort = (columnId) => {
        let direction = "ascending";
        if (
            sortConfig &&
            sortConfig.key === columnId
            // sortConfig.direction === "ascending"
        ) {
            if (sortConfig.direction === "ascending") direction = "descending";
            else if (sortConfig.direction === "descending")
                columnId = undefined;
        }
        // Implement your custom sorting logic here
        // console.log("columnId", columnId, "direction", direction);
        if (columnId)
            fetchTableData(
                `${columnId}:${direction == "ascending" ? "ASC" : "DESC"}`,
                true,
                false
            );
        else fetchTableData(sort, true, false);
        setSortConfig({ key: columnId, direction });
    };

    const getToggleSortProps = (column) => ({
        onClick: () => customSort(column.id),
        style: { cursor: "pointer" }
    });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
        // setFilter,
        // setAllFilters,
        // setGlobalFilter,
        // preGlobalFilteredRows,
        // preFilteredRows,
        // state
    } = useTable(
        {
            columns: memoizedColumns,
            data: memoizedData
        },
        // useGlobalFilter,
        // useFilters,
        useSortBy
    );

    const filterableColumns = memoizedColumns.filter(
        (column) => column.canFilter
    );

    // State to keep track of the selected column for filtering
    const [selectedColumn, setSelectedColumn] = useState("");
    const [filterInput, setFilterInput] = useState("");

    const [globalFilterInput, setGlobalFilterInput] = useState("");
    const [globalFilter, setGlobalFilter] = useState({});

    // Handler for when a new column is selected from the dropdown
    const handleFilterChange = (event) => {
        if (event.target.value) {
            if (event.target.value != selectedColumn) {
                setSelectedColumn(event.target.value);
                setFilterInput("");
                fetchTableData(sort, false, false, true);
            }
        } else {
            setFilterInput("");
            setSelectedColumn(event.target.value);
            fetchTableData(sort, false, false, true);
        }
        // You can also call any function here to actually filter the data based on the selected column
    };

    const handleFilterSubmit = (event) => {
        event.preventDefault();
        // console.log({
        //     [selectedColumn]: {
        //         $contains: filterInput
        //     }
        // });
        // Implement your filter logic here using selectedColumn and filterInput
        if (selectedColumn) {
            // fetchTableData(sort, {
            //     [selectedColumn]: {
            //         $contains: event.target.elements.filterText.value
            //     }
            // });
            // setCurrentPage(0);
            fetchTableData(sort, true, false, true);
        }
    };
    const renderFilter = () => {
        const defaultFilter = {
            accessor: "",
            Header: "Select column to filter"
        };
        return (
            <>
                <Flex
                    style={{
                        margin: "5vh",
                        marginBottom: "2vh",
                        width: "20vw",
                        minWidth: "270px",
                        maxWidth: "300px",
                        // background: "white",
                        borderRadius: "10px",
                        flexDirection: "column"
                    }}
                >
                    <Select
                        // placeholder="Select column to filter"
                        onChange={handleFilterChange}
                        value={selectedColumn}
                        style={{ background: "white" }}
                    >
                        {[defaultFilter, ...filterableColumns].map((column) => (
                            <option
                                key={column.accessor}
                                value={column.accessor}
                            >
                                {column.Header}
                            </option>
                        ))}
                    </Select>
                    {selectedColumn && (
                        <form onSubmit={handleFilterSubmit}>
                            <Input
                                style={{ background: "white" }}
                                placeholder="Enter filter text"
                                name="filterText"
                                value={filterInput}
                                onChange={(e) => setFilterInput(e.target.value)}
                            />
                        </form>
                    )}
                </Flex>
            </>
        );
    };
    const renderGlobalFilter = () => {
        const userFilter =
            role == "admin" ? "assignto" : role == "creator" ? "" : "creator";
        const handleGlobalFilterSubmit = (e) => {
            e.preventDefault();
            const filter = userFilter
                ? {
                    $or: [
                        { name: globalFilterInput },
                        { news_article: { status: globalFilterInput } },
                        {
                            news_article: {
                                [userFilter]: {
                                    $or: [
                                        {
                                            fullName: globalFilterInput
                                        },
                                        {
                                            username: globalFilterInput
                                        },
                                        {
                                            email: globalFilterInput
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
                : {
                    $or: [
                        { name: globalFilterInput },
                        { news_article: { status: globalFilterInput } }
                    ]
                };
            setGlobalFilter(filter);
            fetchTableData(sort, false, false, true);
        };
        return (
            <>
                <form
                    onSubmit={handleGlobalFilterSubmit}
                    style={{
                        background: "white",
                        margin: "5vh",
                        marginBottom: "2vh",
                        width: "20vw",
                        minWidth: "270px",
                        maxWidth: "300px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        position: "relative" // Added for absolute positioning of the icon
                    }}
                >
                    <Input
                        placeholder="Stay Name, Status"
                        name="filterText"
                        value={globalFilterInput}
                        onChange={(e) => setGlobalFilterInput(e.target.value)}
                    />
                    <Search2Icon
                        style={{
                            position: "absolute", // Position the icon inside the input
                            right: "10px", // Distance from the left edge of the input
                            top: "50%", // Center vertically
                            transform: "translateY(-50%)", // Center vertically
                            pointerEvents: "none" // Make the icon non-interactive
                        }}
                    />
                </form>
            </>
        );
    };

    const AssignStoryTeller = ({ news_article, storyTellerList }) => {
        const [showConfirmationBox, setShowConfirmationBox] = useState({
            mode: false,
            message: `Are you sure you want to update the Storyteller?`
        });
        const [creatorId, setCreatorId] = useState(
            news_article?.creator?.id || null
        );

        const handleChange = (e) => {
            const value =
                e.target.value === "Not Assigned" ? null : e.target.value;
            setCreatorId(value);
            setShowConfirmationBox((prevValue) => {
                return { ...prevValue, mode: true };
            });
        };

        const updateCreator = () => {
            const dataToUpdate = { creator: creatorId };
            updateDBValue(
                apiNames.newsArticles,
                news_article?.id,
                dataToUpdate
            ).then((response) => {
                fetchSingleAlbum(news_article?.id, "edit");
            });
        };
        return (
            <>
                <PostcardAlert
                    show={showConfirmationBox}
                    handleAction={updateCreator}
                    closeAlert={() =>
                        setShowConfirmationBox((prevValue) => {
                            return { ...prevValue, mode: false };
                        })
                    }
                    buttonText="UPDATE"
                />
                {storyTellerList.length == 0 && (
                    <Flex justifyContent={"center"} alignItems={"center"}>
                        <Spinner />
                    </Flex>
                )}
                {storyTellerList && storyTellerList.length > 0 && (
                    <Select
                        bg="cardBackground"
                        onChange={handleChange}
                        placeholder={news_article?.creator?.fullName}
                        value={creatorId}
                    >
                        <option value={"Not Assigned"}>Not Assigned</option>
                        {storyTellerList?.map((value, i) => (
                            <option key={i} value={value.id}>
                                {value.fullName}
                            </option>
                        ))}
                    </Select>
                )}
            </>
        );
    };

    return tableConfig.columns && !loading ? (
        <>
            {role == "admin" && (
                <Flex justify={"space-between"} mx="5vh">
                    <Text
                        fontSize="1.5rem"
                        textAlign={"left"}
                        color="primary_3"
                        fontWeight={"bold"}
                    >
                        {profile?.fullName || "Admin"}'s Assignment Dashboard
                    </Text>
                    <Button
                        onClick={() => {
                            setShowCreateAlbum(true);
                        }}
                    >
                        Create New
                    </Button>
                    <PostcardModal
                        size="3xl"
                        isShow={showCreateAlbum}
                        headerText={"Create"}
                        children={
                            <CollectionForm
                                onClose={() => {
                                    setShowCreateAlbum(false);
                                }}
                                mode="create"
                                fetchSingleAlbum={fetchSingleAlbum}
                            ></CollectionForm>
                        }
                        handleClose={() => setShowCreateAlbum(false)}
                    />
                </Flex>
            )}
            {["mentor", "eic", "creator"].includes(role) && (
                <Flex justify={"space-between"} mx="5vh">
                    <Text
                        fontSize="1.5rem"
                        textAlign={"left"}
                        color="primary_3"
                        fontWeight={"bold"}
                    >
                        {profile?.fullName ||
                            `${role == "mentor"
                                ? "Mentor"
                                : role == "eic"
                                    ? "Editor in Chief"
                                    : "StoryTeller"
                            }`}
                        's Assignment Dashboard
                    </Text>
                </Flex>
            )}
            {/* {renderFilter()} */}
            {/* {renderGlobalFilter()} */}
            {data && data.length > 0 ? (
                <>
                    <TableContainer margin={"5vh"} marginTop={"1vh"}>
                        <Table
                            {...getTableProps()}
                            // variant="striped"
                            // colorScheme="beige"
                            loading={loading}
                            sx={{
                                width: "100%",
                                tableLayout: "fixed",
                                borderCollapse: "collapse",
                                marginBottom: "20px"
                            }}
                        >
                            <Thead marginBottom={"auto"}>
                                {headerGroups.map((headerGroup) => (
                                    <Tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <Th
                                                {...column.getHeaderProps(
                                                    column.canSort
                                                        ? getToggleSortProps(
                                                            column
                                                        )
                                                        : {}
                                                )}
                                                sx={{
                                                    textColor: "black",
                                                    textAlign: "center",
                                                    width: "fit-content",
                                                    padding: "auto",
                                                    whiteSpace: "wrap"
                                                }}
                                            >
                                                <Flex
                                                    alignItems={"center"}
                                                    justifyContent={"center"}
                                                >
                                                    {column.Header !==
                                                        "Actions" &&
                                                        column.render("Header")}
                                                    {/* Add a sort direction indicator */}
                                                    {column.canSort &&
                                                        (column.id ==
                                                            sortConfig.key ? (
                                                            sortConfig.direction ==
                                                                "descending" ? (
                                                                <FaSortDown
                                                                    style={{
                                                                        marginLeft:
                                                                            "5px",
                                                                        fontSize:
                                                                            "16px"
                                                                    }}
                                                                />
                                                            ) : (
                                                                <FaSortUp
                                                                    style={{
                                                                        marginLeft:
                                                                            "5px",
                                                                        fontSize:
                                                                            "16px"
                                                                    }}
                                                                />
                                                            )
                                                        ) : (
                                                            <FaSort
                                                                boxSi
                                                                style={{
                                                                    marginLeft:
                                                                        "5px",
                                                                    fontSize:
                                                                        "16px"
                                                                }}
                                                            />
                                                        ))}
                                                </Flex>
                                            </Th>
                                        ))}
                                    </Tr>
                                ))}
                            </Thead>

                            <Tbody {...getTableBodyProps()}>
                                {rows.map((row) => {
                                    prepareRow(row);
                                    return (
                                        <Tr
                                            {...row.getRowProps()}
                                            style={{
                                                maxHeight: "20px",
                                                lineHeight: "20px"
                                            }}
                                            // _odd={{
                                            //     td: {
                                            //         // background: `${row.original.news_article.status == "draft" ? "#f5896d!important" : "#C6B38D!important"}`
                                            //         background:
                                            //             "#FEECDE!important"
                                            //     }
                                            // }}
                                            _hover={{
                                                td: {
                                                    background:
                                                        "#e0d0c3!important"
                                                }
                                            }}
                                            bg="white"
                                        >
                                            {row.cells.map((cell) => (
                                                <Td
                                                    {...cell.getCellProps()}
                                                    style={{
                                                        // border: "1.5px solid grey",
                                                        whiteSpace: "wrap"
                                                    }}
                                                >
                                                    {cell.column.Header !==
                                                        "Actions" &&
                                                        (cell.column.Header ==
                                                            "StoryTeller" &&
                                                            role == "mentor" ? (
                                                            <AssignStoryTeller
                                                                news_article={
                                                                    row.original
                                                                        ?.news_article
                                                                }
                                                                storyTellerList={
                                                                    storyTellerList
                                                                }
                                                            />
                                                        ) : (
                                                            cell.render("Cell")
                                                        ))}
                                                    {cell.column.Header ==
                                                        "Actions" && (
                                                            <DashboardActionCell
                                                                role={role}
                                                                data={row.original}
                                                                refetch={
                                                                    fetchTableData
                                                                }
                                                                fetchSingleAlbum={
                                                                    fetchSingleAlbum
                                                                }
                                                            />
                                                        )}
                                                </Td>
                                            ))}
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                        <ReactPaginate
                            previousLabel={
                                <ChevronLeftIcon style={{ margin: "auto" }} />
                            }
                            nextLabel={<ChevronRightIcon />}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                            forcePage={currentPage}
                        />
                    </TableContainer>
                </>
            ) : (
                <>
                    <Box textAlign="center" m="5vh">
                        <Text>No records found.</Text>
                    </Box>
                </>
            )}
        </>
    ) : (
        <>
            <LoadingGif />
        </>
    );
};

export default DashboardTable;
