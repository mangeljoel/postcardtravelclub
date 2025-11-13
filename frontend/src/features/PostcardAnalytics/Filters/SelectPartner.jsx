import { Button, Text } from "@chakra-ui/react";
import OptionSelection from "../../GuidedSearch/OptionSelection";
import PostcardModal from "../../PostcardModal";
import { CloseIcon } from "@chakra-ui/icons";

const SelectPartner = ({
    showPartnerFilter,
    setShowPartnerFilter,
    selectedPartner,
    setSelectedPartner,
    partnerList,
    setEditTags
}) => {
    let buttonStyle = {};
    if (!selectedPartner) {
        buttonStyle = {
            variant: "outlined",
            border: "1px solid #EA6147",
            color: "#EA6147"
        };
    }
    return (
        <>
            <Button
                // variant={"outlined"}
                // border="1px solid #F5896D"
                // color={"#F5896D"}
                display="flex"
                alignItems={"center"}
                {...buttonStyle}
                height={"36px"}
                mx="5"
                ml="2.5"
                gap="10px"
                onClick={() => setShowPartnerFilter(!showPartnerFilter)}
            >
                <Text>{selectedPartner?.name || "Filter Property"} </Text>
                {selectedPartner && (
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
                            setSelectedPartner(null);
                            setEditTags([]);
                        }}
                    >
                        <CloseIcon height="12px" width="12px" />
                    </button>
                )}
            </Button>
            <PostcardModal
                isShow={showPartnerFilter}
                headerText={"Select Partner"}
                children={
                    <OptionSelection
                        hideTitle={true}
                        showOptions={true}
                        setSelectedOption={(e) => {
                            // console.log(e);
                            setSelectedPartner({ id: e.id, name: e.name });
                            setEditTags([]);
                            setShowPartnerFilter(false);
                        }}
                        selectedOption={null}
                        optionSet={partnerList}
                        label={"partner"}
                        name={"Partner"}
                        placeholder={"Select Partner"}
                    />
                }
                handleClose={() => {
                    // setSelectedCountry(null);
                    setShowPartnerFilter(false);
                }}
                style={{ padding: "20px", width: "100%", minHeight: "50vh" }}
                size={"lg"}
            />
        </>
    );
};

export default SelectPartner;
