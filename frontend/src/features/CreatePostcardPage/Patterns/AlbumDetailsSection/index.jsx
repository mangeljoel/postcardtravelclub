import { Box, Flex, Input } from "@chakra-ui/react";
import {
    CameraIcon,
    LinkIcon,
    LocationIcon,
    PriceIcon,
    PropertyIcon,
    RoomIcon,
    WebsiteIcon
} from "../../../../styles/ChakraUI/icons";
import AlbumDetailsInput from "./AlbumDetailsInput";
import { Field } from "formik";
import { AutoCompleteField } from "../../../../patterns/FormBuilder/AutoCompleteField";
import { useEffect, useState } from "react";
import { updateDBValue } from "../../../../queries/strapiQueries";
import { apiNames } from "../../../../services/fetchApIDataSchema";

const AlbumDetailsSection = (props) => {
    const { formikProps, countryList, albumId } = props;
    const albumDetailsArray = [
        {
            id: 1,
            icon: <PropertyIcon w="20px" h="20px" mr="1em" />,
            text: "Property Name",
            inputUI: (
                <Field
                    as={Input}
                    id="name"
                    px={"1em"}
                    name="name"
                    type="text"
                    w="50%"
                    isDisabled={props.isDisabled}
                    placeholder="Enter Name..."
                    borderWidth="1.5px"
                    borderColor="#BFBFBF"
                    _focusVisible={{ borderColor: "#BFBFBF" }}
                    onBlur={(e) => {
                        if (e && e.target.value && albumId)
                            updateDBValue(apiNames.album, albumId, {
                                name: e.target.value
                            });
                    }}
                />
            )
        },
        {
            id: 2,
            icon: <LocationIcon w="20px" h="20px" mr="1em" />,
            text: "Country",
            inputUI: (
                <Box w="50%">
                    <Field
                        id="country"
                        name="country"
                        isDisabled={props.isDisabled}
                        onBlur={(e) => {
                            if (
                                formikProps &&
                                albumId &&
                                formikProps.values?.country
                            )
                                updateDBValue(apiNames.album, albumId, {
                                    country: formikProps.values?.country?.id
                                });
                        }}
                    >
                        {(field, form) => (
                            <AutoCompleteField
                                component={{
                                    ...field,
                                    label: "country",
                                    isVisible: true,
                                    name: "Country",
                                    fieldStyle: {
                                        borderWidth: "1.5px",
                                        borderColor: "#BFBFBF",
                                        bg: "transparent",
                                        _focusVisible: {
                                            borderColor: "#BFBFBF"
                                        }
                                    },
                                    placeholder: "Select Country",
                                    options: countryList,
                                    optionType: "object",
                                    displayKey: "name",
                                    valueKey: "id",

                                    onChange: (e) => {},
                                    onSelectOption: (e) => {
                                        if (
                                            formikProps &&
                                            albumId &&
                                            formikProps.values?.country
                                        )
                                            updateDBValue(
                                                apiNames.album,
                                                albumId,
                                                {
                                                    country:
                                                        formikProps.values
                                                            ?.country?.id
                                                }
                                            );
                                    }
                                }}
                                value={formikProps.values.country}
                                onChange={(e) => {
                                    formikProps.setFieldValue("country", e);
                                }}
                                isDisabled={props.isDisabled}
                            />
                        )}
                    </Field>
                </Box>
            )
        },
        {
            id: 3,
            icon: <RoomIcon w="20px" h="20px" mr="1em" />,
            text: "No. of rooms",
            inputUI: (
                <Field
                    as={Input}
                    id="rooms"
                    px={"1em"}
                    w="50%"
                    name="rooms"
                    type="number"
                    isDisabled={props.isDisabled}
                    placeholder="Enter No. of rooms..."
                    borderWidth="1.5px"
                    borderColor="#BFBFBF"
                    _focusVisible={{ borderColor: "#BFBFBF" }}
                    onBlur={(e) => {
                        if (e && e.target.value && albumId)
                            updateDBValue(apiNames.album, albumId, {
                                numberOfNights: e.target.value
                            });
                    }}
                />
            )
        },
        {
            id: 4,
            icon: <LinkIcon w="20px" h="20px" mr="1em" />,
            text: "Website link",
            inputUI: (
                <Field
                    as={Input}
                    id="website"
                    px={"1em"}
                    w="50%"
                    name="website"
                    type="text"
                    isDisabled={props.isDisabled}
                    placeholder="Enter Website link..."
                    borderWidth="1.5px"
                    borderColor="#BFBFBF"
                    _focusVisible={{ borderColor: "#BFBFBF" }}
                    onBlur={(e) => {
                        if (e && e.target.value && albumId)
                            updateDBValue(apiNames.album, albumId, {
                                website: e.target.value
                            });
                    }}
                />
            )
        },
        {
            id: 5,
            icon: <WebsiteIcon w="20px" h="20px" mr="1em" />,
            text: "Latitude, Longitude",
            inputUI: (
                <Flex w="50%">
                    <Field
                        as={Input}
                        id="lat"
                        px={"1em"}
                        w="50%"
                        name="lat"
                        type="number"
                        isDisabled={props.isDisabled}
                        placeholder="Enter latitude..."
                        borderWidth="1.5px"
                        borderColor="#BFBFBF"
                        _focusVisible={{
                            borderColor: "#BFBFBF"
                        }}
                        onBlur={(e) => {
                            if (e && e.target.value && albumId)
                                updateDBValue(apiNames.album, albumId, {
                                    lat: e.target.value
                                });
                        }}
                    />
                    <Field
                        as={Input}
                        id="long"
                        px={"1em"}
                        w="50%"
                        name="long"
                        type="number"
                        isDisabled={props.isDisabled}
                        placeholder="Enter longitude..."
                        borderWidth="1.5px"
                        borderColor="#BFBFBF"
                        _focusVisible={{ borderColor: "#BFBFBF" }}
                        onBlur={(e) => {
                            if (e && e.target.value && albumId)
                                updateDBValue(apiNames.album, albumId, {
                                    long: e.target.value
                                });
                        }}
                    />
                </Flex>
            )
        },
        {
            id: 6,
            icon: <PriceIcon w="20px" h="20px" mr="1em" />,
            text: "Starting price/night (in USD)",
            inputUI: (
                <Field
                    as={Input}
                    id="startingprice"
                    px={"1em"}
                    w="50%"
                    name="startingprice"
                    type="text"
                    isDisabled={props.isDisabled}
                    placeholder="Enter starting price..."
                    borderWidth="1.5px"
                    borderColor="#BFBFBF"
                    _focusVisible={{ borderColor: "#BFBFBF" }}
                    onBlur={(e) => {
                        if (e && e.target.value && albumId)
                            updateDBValue(apiNames.album, albumId, {
                                pricesStartingAt: e.target.value
                            });
                    }}
                />
            )
        }
    ];
    return (
        <Box>
            {albumDetailsArray &&
                albumDetailsArray.map((detail, index) => {
                    return (
                        <AlbumDetailsInput index={index} mb="1em" {...detail} />
                    );
                })}
        </Box>
    );
};
export default AlbumDetailsSection;
