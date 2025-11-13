import { Heading } from "@chakra-ui/react";

const ExpertHeader = ({ heading, subHeading }) => {
    return (
        <>
            <Heading textAlign="center" variant="pageHeading">
                {heading}
            </Heading>
            <Heading
                w={{ lg: "60%" }}
                mt="16px"
                mb="24px"
                variant="pageSubHeading"
            >
                {subHeading}
            </Heading>
        </>
    );
};
export default ExpertHeader;
