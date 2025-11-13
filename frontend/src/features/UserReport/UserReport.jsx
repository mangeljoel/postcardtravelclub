import React, { useState, useEffect, useContext } from "react";
import {
    useTable,
    useSortBy,
    usePagination,
    useFilters,
    useGlobalFilter,
    useAsyncDebounce
} from "react-table";
import strapi from "../../queries/strapi";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
    Table,
    Flex,
    Box,
    Thead,
    Tbody,
    Text,
    Link,
    Button,
    Tr,
    Th,
    Td
} from "@chakra-ui/react";
import LoadingGif from "../../patterns/LoadingGif";
import AppContext from "../AppContext";
import ExportAsExcel from "../../services/ExportAsExcel";
import { makeData } from "./makeData";
import { now } from "moment";
import {
    DefaultColumnFilter,
    DefaultSelectFilter,
    GlobalFilter
} from "./CustomFilterComponents";

function UserReport({ type }) {
    const timestamp = new Date().getTime();
    const [users, setUsers] = useState([]);
    const { profile } = useContext(AppContext);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageDetails, setPageDetails] = useState({
        type: "userReport",
        fileName: "userReport" + timestamp + ".xlsx",
        sheetName: "userReport",
        apiName: "userslist8775",
        columns: [
            {
                Header: "Username",
                accessor: "fullName"
            },
            {
                Header: "Email",
                accessor: "email"
            },
            {
                Header: "slug",
                accessor: "slug"
            },
            {
                Header: "bio",
                accessor: "bio"
            },
            {
                Header: "date",
                accessor: "createdAt"
            }
        ]
    });
    const [currentPage, setCurrentPage] = useState(0);

    const formatDate = (date) => {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        };
        return new Date(date).toLocaleDateString("en-US", options);
    };

    useEffect(() => {
        setLoading(true);
        let pageData = {};
        if (type === "statistics")
            pageData = {
                type: "statistics",
                fileName: "statisticsReports" + timestamp + ".xlsx",
                sheetName: "statisticsReports",
                apiName: "events/stats",

                columns: [
                    {
                        Header: "Company",
                        accessor: "company",
                        canFilter: false,
                        Filter: null
                    },

                    {
                        Header: "Postcard Page",
                        accessor: "name",
                        canFilter: false,
                        Filter: null
                    },
                    {
                        Header: "Postcards",
                        accessor: "postcards_count",
                        canFilter: false,
                        Filter: null
                    },
                    {
                        Header: "Postcard Page Visits",
                        accessor: "visit_count",
                        canFilter: false,
                        Filter: null
                    },
                    {
                        Header: "Followers",
                        accessor: "follow_count",
                        canFilter: false,
                        Filter: null
                    },
                    {
                        Header: "Postcards Collected",
                        accessor: "postcards_collected_count",
                        canFilter: false,
                        Filter: null
                    },
                    {
                        Header: "Website Visits",
                        accessor: "website_visit",
                        canFilter: false,
                        Filter: null
                    }
                ]
            };
        else if (type === "userReport")
            pageData = {
                type: "userReport",
                fileName: "userReport" + timestamp + ".xlsx",
                sheetName: "userReport",
                apiName: "userslist8775",
                columns: [
                    {
                        Header: "Username",
                        accessor: "fullName",
                        Filter: null
                    },
                    {
                        Header: "Email",
                        accessor: "email",
                        Filter: null
                    },
                    {
                        Header: "ProfilePage",
                        id: "link",
                        accessor: "slug",
                        Filter: null,

                        Cell: ({ row }) => {
                            return row.original.slug ? (
                                <Link
                                    href={row.original.slug}
                                    textDecor={"underline"}
                                >
                                    {row.original.slug}
                                </Link>
                            ) : (
                                row.original.slug
                            );
                        }
                    },
                    {
                        Header: "bio",
                        accessor: "bio",
                        Filter: null
                    },
                    {
                        Header: "bookmarkedCount",
                        accessor: "bookmarkedCount",
                        Filter: null
                    },
                    {
                        Header: "date",
                        accessor: "createdAt",
                        Filter: null
                    }
                ]
            };
        else if (type === "userStats")
            pageData = {
                type: "userStats",
                fileName: "userStats" + timestamp + ".xlsx",
                sheetName: "userStats",
                apiName: "userslist8775",
                columns: [
                    {
                        Header: "Username",
                        accessor: "fullName",
                        Filter: null
                    },

                    {
                        Header: "Email",
                        accessor: "email",
                        Filter: null
                    },
                    {
                        Header: "Postcards",
                        accessor: "noOfpostcards",
                        Filter: null
                        //Filter: DefaultColumnFilter
                    },
                    {
                        Header: "Album Name",
                        id: "link",
                        accessor: "albumName",
                        Filter: null,

                        Cell: ({ row }) => {
                            return row.original.albumName !== "-" ? (
                                <Link
                                    href={row.original.albumPage}
                                    textDecor={"underline"}
                                >
                                    {row.original.albumName}
                                </Link>
                            ) : (
                                row.original.albumName
                            );
                        }
                    },
                    {
                        Header: "Album Status",
                        id: "status",
                        accessor: "albumStatus",
                        Filter: null
                    },

                    {
                        Header: "User Type",
                        accessor: "userType",
                        canFilter: true,
                        Filter: DefaultSelectFilter
                    }
                ]
            };
        setPageDetails(pageData);
        fetchPageData(pageData);
    }, [type]);
    useEffect(() => {}, [pageDetails]);
    // const fetchPageData = async (pageData) => {
    //     await strapi
    //         .find(pageData.apiName, {
    //             sort: { id: "desc" },
    //             populate: pageData?.populate
    //         })
    //         .then((response) => {
    //             if (pageData.type === "userStats")
    //                 setUsers(
    //                     makeData(
    //                         response.data
    //                             ? response.data
    //                             : response.filter((record) => {
    //                                   if (record.user_type) {
    //                                       if (
    //                                           record.user_type.name ===
    //                                               "Hotels" ||
    //                                           record.user_type.name ===
    //                                               "Tour Operators" ||
    //                                           record.user_type.name ===
    //                                               "StoryTeller"
    //                                       )
    //                                           return record;
    //                                   }
    //                               })
    //                     )
    //                 );
    //             else setUsers(response.data ? response.data : response);

    //             setTotalPages(1);
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };

    const fetchPageData = async (pageData) => {
        try {
            let data = [];
            let pageNo = 1;
            let pageCount = 1;

            do {
                let res =
                    pageData.type === "statistics"
                        ? await strapi.find(pageData.apiName)
                        : await strapi.find(pageData.apiName, {
                              sort: { id: "desc" },
                              populate: pageData?.populate,
                              pagination: {
                                  page: pageNo,
                                  pageSize: 100
                              }
                          });

                if (res?.meta) {
                    data.push(res.data ? res.data : res);
                    if (pageCount === 1) {
                        pageCount = res.meta.pagination.pageCount;
                    }
                } else if (Array.isArray(res)) data.push(res);
                Array.isArray(res) ? (pageNo = 2) : pageNo++;
            } while (pageNo <= pageCount);

            data = data.flat();

            // Process or utilize the fetched data
            if (pageData.type === "userStats") {
                setUsers(
                    makeData(
                        data.filter((record) => {
                            if (record.user_type) {
                                if (
                                    record.user_type.name === "Hotels" ||
                                    record.user_type.name ===
                                        "Tour Operators" ||
                                    record.user_type.name === "StoryTeller"
                                )
                                    return record;
                            }
                        })
                    )
                );
            } else {
                setUsers(data.length > 0 ? data : []);
            }

            setTotalPages(1);
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const columns = React.useMemo(() => pageDetails.columns, [pageDetails]);

    const data = React.useMemo(() => users, [users]);
    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter
        }),
        []
    );
    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            //fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter((row) => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? String(rowValue)
                              .toLowerCase()
                              .startsWith(String(filterValue).toLowerCase())
                        : true;
                });
            }
        }),
        []
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        state,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: { pageIndex }
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            defaultCanFilter: false,
            filterTypes,
            initialState: { pageIndex: 0 }
        },

        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    return (
        <>
            {loading ? (
                <LoadingGif />
            ) : (
                <Box p="5vw">
                    <Flex justifyContent="space-between">
                        {" "}
                        <Box colSpan={visibleColumns.length} my="auto">
                            {" "}
                            <GlobalFilter
                                preGlobalFilteredRows={preGlobalFilteredRows}
                                globalFilter={state.globalFilter}
                                setGlobalFilter={setGlobalFilter}
                                useAsyncDebounce={useAsyncDebounce}
                            />
                        </Box>{" "}
                        <ExportAsExcel
                            csvData={users}
                            fileName={pageDetails.fileName}
                            sheetName={[pageDetails.sheetName]}
                            buttonName="Export as Excel"
                            fileType={"xlsx"}
                            my="2em"
                            //="auto"
                        />
                    </Flex>
                    <Table
                        className="custom-table"
                        variant="striped"
                        colorScheme="blue"
                        {...getTableProps()}
                    >
                        <Thead bgColor="primary_1" color="white" h="8vh">
                            {headerGroups.map((headerGroup) => (
                                <Tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <Th>
                                            <Flex>
                                                {" "}
                                                {column.render("Header")}
                                                <span
                                                    {...column.getHeaderProps(
                                                        column.getSortByToggleProps()
                                                    )}
                                                >
                                                    {column.isSorted ? (
                                                        column.isSortedDesc ? (
                                                            <FaSortDown
                                                                style={{
                                                                    marginLeft:
                                                                        "5px"
                                                                }}
                                                            />
                                                        ) : (
                                                            <FaSortUp
                                                                style={{
                                                                    marginLeft:
                                                                        "5px"
                                                                }}
                                                            />
                                                        )
                                                    ) : (
                                                        <FaSort
                                                            style={{
                                                                marginLeft:
                                                                    "5px"
                                                            }}
                                                        />
                                                    )}
                                                </span>
                                            </Flex>
                                            <Box
                                                py={2}
                                                onClick={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                {column.Filter
                                                    ? column.render("Filter")
                                                    : null}
                                            </Box>
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </Thead>
                        <Tbody {...getTableBodyProps()}>
                            {page.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <Tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => {
                                            return (
                                                <Td {...cell.getCellProps()}>
                                                    {cell.column.Header ===
                                                    "date"
                                                        ? formatDate(cell.value)
                                                        : cell.render("Cell")}
                                                </Td>
                                            );
                                        })}
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                    <Box className="Pagination">
                        <button
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                        >
                            <b> Previous Page</b>
                        </button>
                        {"  "}
                        <button
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                        >
                            <b> Next Page </b>
                        </button>
                        {"  "}
                        <span>
                            Page{"  "}
                            <strong>
                                {pageIndex + 1} of {pageOptions.length}
                            </strong>{" "}
                        </span>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default UserReport;
