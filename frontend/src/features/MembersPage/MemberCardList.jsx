import { SimpleGrid } from "@chakra-ui/react";
import MembersCard from "./MembersCard";
import { useRouter } from "next/router";

const MembersCardList = (props) => {
    const { displayMembers, isAffiliation, ...restProps } = props;
    const router = useRouter();
    return (
        <SimpleGrid
            columns={[1, 5]}
            spacing={[2, 5]}
            width={["100%", "90%"]}
            mx={"auto"}
            textAlign={"center"}
            my="5%"
            {...restProps}
        >
            {displayMembers &&
                displayMembers.length > 0 &&
                displayMembers.map((member, index) => {
                    return (
                        <MembersCard
                            key={"member" + index}
                            member={member}
                            isAffiliation={isAffiliation}
                            onClick={() => {
                                if (isAffiliation) {
                                    if (member.slug)
                                        router.push(
                                            "/affiliations/" + member.slug
                                        );
                                } else {
                                    if (member.slug) {
                                        router.push("/" + member.slug);
                                    }
                                }
                            }}
                        />
                    );
                })}
        </SimpleGrid>
    );
};
export default MembersCardList;
