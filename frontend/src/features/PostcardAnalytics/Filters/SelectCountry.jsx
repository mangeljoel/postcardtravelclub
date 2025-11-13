import { CloseIcon } from "@chakra-ui/icons";
import OptionSelection from "../../GuidedSearch/OptionSelection";
import PostcardModal from "../../PostcardModal";
import { Button, Text } from "@chakra-ui/react";
import { useState } from "react";

const SelectCountry = ({
    selectedCountry,
    setSelectedCountry,
    setEditTags,
    setSelectedPartner,
    countryList,
    customButtom,
    allCountriesOption
}) => {
    const [showEditCountry, setShowEditCountry] = useState(false);
    let buttonStyle = {};
    if (allCountriesOption && countryList[0]?.id != -1) {
        countryList?.unshift({ name: "All Countries", id: -1 });
    }
    if (!selectedCountry) {
        buttonStyle = {
            variant: "outlined",
            border: "1px solid #EA6147",
            color: "#EA6147"
        };
    }

    const handleShowCountry = () => setShowEditCountry(!showEditCountry);
    return (
        <>
            {customButtom ? (
                customButtom(handleShowCountry)
            ) : (
                <Button
                    gap="10px"
                    mx="5"
                    mr="2.5"
                    // variant={"outlined"}
                    // border="1px solid #F5896D"
                    // color={"#F5896D"}
                    display="flex"
                    alignItems="center"
                    {...buttonStyle}
                    height={"36px"}
                    onClick={handleShowCountry}
                >
                    <Text>
                        {selectedCountry
                            ? typeof selectedCountry == "string"
                                ? selectedCountry
                                : selectedCountry?.name
                            : "Filter Country"}{" "}
                    </Text>
                    {selectedCountry && (
                        <button
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0", // Ensure no padding affects the centering
                                marginLeft: "10px",
                                background: "none", // Remove any default button styles
                                border: "none" // Remove any default button border
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCountry(null);
                                setEditTags && setEditTags([]);
                                setSelectedPartner && setSelectedPartner(null);
                            }}
                        >
                            <CloseIcon height="12px" width="12px" />
                        </button>
                    )}
                </Button>
            )}
            <PostcardModal
                isShow={showEditCountry}
                headerText={"Select Country"}
                children={
                    <OptionSelection
                        hideTitle={true}
                        showOptions={true}
                        setSelectedOption={(e) => {
                            setSelectedCountry(e);
                            setEditTags && setEditTags([]);
                            setSelectedPartner && setSelectedPartner(null);
                            setShowEditCountry(false);
                        }}
                        selectedOption={null}
                        label={"country"}
                        name={"Country"}
                        placeholder={"Select Country"}
                        optionSet={countryList}
                    />
                }
                handleClose={() => {
                    // setSelectedCountry(null);
                    setShowEditCountry(false);
                }}
                style={{ padding: "20px", width: "100%", minHeight: "50vh" }}
                size={"lg"}
            />
        </>
    );
};

export default SelectCountry;
