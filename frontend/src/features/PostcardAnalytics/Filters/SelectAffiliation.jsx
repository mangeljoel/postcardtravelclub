import { CloseIcon } from "@chakra-ui/icons";
import OptionSelection from "../../GuidedSearch/OptionSelection";
import PostcardModal from "../../PostcardModal";
import { Button, Text } from "@chakra-ui/react";

const SelectAffiliation = ({
    selectedAffiliation,
    setSelectedAffliliation,
    showAffiliationList,
    setShowAffiliationList,
    affiliationList,
    setSelectedCountry,
    setEditTags,
    setSelectedPartner
}) => {
    let buttonStyle = {};
    if (!selectedAffiliation) {
        buttonStyle = {
            variant: "outlined",
            border: "1px solid #EA6147",
            color: "#EA6147"
        };
    }
    return (
        <>
            <Button
                gap="10px"
                {...buttonStyle}
                height={"36px"}
                display="flex"
                alignItems="center"
                onClick={() => setShowAffiliationList(!showAffiliationList)}
            >
                <Text>{selectedAffiliation?.name || "Filter Affiliation"}</Text>
                {selectedAffiliation && (
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
                            setSelectedAffliliation(null);
                            setSelectedCountry(null);
                            setSelectedPartner(null);
                            setEditTags([]);
                        }}
                    >
                        <CloseIcon height="12px" width="12px" />
                    </button>
                )}
            </Button>

            <PostcardModal
                isShow={showAffiliationList}
                headerText={"Select Affiliation"}
                children={
                    <OptionSelection
                        hideTitle={true}
                        showOptions={true}
                        optionSet={affiliationList}
                        setSelectedOption={(e) => {
                            setSelectedAffliliation({ id: e.id, name: e.name });
                            setEditTags([]);
                            setSelectedPartner(null);
                            setSelectedCountry(null);
                            setShowAffiliationList(false);
                        }}
                        selectedOption={null}
                        label={"affiliation"}
                        name={"Affiliation"}
                        placeholder={"Select Affiliation"}
                    />
                }
                handleClose={() => {
                    // setSelectedCountry(null);
                    setShowAffiliationList(false);
                }}
                style={{ padding: "20px", width: "100%", minHeight: "50vh" }}
                size={"lg"}
            />
        </>
    );
};

export default SelectAffiliation;
