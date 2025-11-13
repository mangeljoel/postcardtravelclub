import { Flex, Image, Box, Text } from "@chakra-ui/react";

const MembersCard = ({ member, onClick, isAffiliation }) => {
    return (
        <Flex
            // background="#ffffff"
            boxSizing="border-box"
            // boxShadow="0px 2px 6px rgba(0, 0, 0, 0.16)"
            borderRadius="20px"
            textAlign={"left"}
            width={"100%"}
            padding={["12px", "16px"]}
            pos="relative"
            onClick={isAffiliation && onClick}
            cursor={"pointer"}
            ///my="1em"
            direction={"column"}
            justifyContent={"space-between"}
        >
            <Image
                src={
                    isAffiliation
                        ? member.logo
                            ? member.logo.url
                            : "/assets/no-avatar.png"
                        : member.company.icon
                            ? member.company.icon?.url
                            : "/assets/no-avatar.png"
                }
                width={["70vw", "15vw"]}
                ratio={1}
                my="1em"
                mx="auto"
                objectFit={"contain"}
                height={["70vw", "10vw"]}
                alt="member"
            // borderRadius={"full"}
            />
            {isAffiliation && <Text
                textAlign={"center"}
                fontWeight={"semibold"}
                fontSize={["4vw", "1vw"]}
            >
                {member.name}
            </Text>}
            {/* <Text
                textAlign={"center"}
                fontWeight={"semibold"}
                fontSize={["4vw", "1vw"]}
            >
                {isAffiliation ? member.name : member.company.name}
            </Text> */}
            {/* <Text
                my="1em"
                fontWeight="bold"
                color="primary_3"
                textAlign={"center"}
                fontSize={["4vw", "0.8vw"]}
            >
                {isAffiliation
                    ? member.companies.length
                    : member.postcardsCreated}{" "}
                {isAffiliation
                    ? member.companies.length > 1
                        ? "partners"
                        : "partner"
                    : member.postcardsCreated > 1
                      ? "postcards"
                      : "postcard"}
            </Text> */}
            {/* <Flex my="auto">
                    <Image
                        width={["8vw", "3vw"]}
                        height="auto"
                        src="/assets/images/stack_pc.png"
                        objectFit={"contain"}
                    />
                    <Text mx="1em" fontWeight="bold" my="auto">
                        {" "}
                        45
                    </Text>
                </Flex> */}
        </Flex>
    );
};
export default MembersCard;
