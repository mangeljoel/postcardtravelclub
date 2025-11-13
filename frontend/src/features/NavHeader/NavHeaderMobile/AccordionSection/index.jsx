import {
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Icon,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChevronDownIcon } from "@chakra-ui/icons";

const AccordionSection = ({ key, label, onClose, href, items }) => {
    const { isOpen, onToggle } = useDisclosure();
    const router = useRouter();

    return (
        <AccordionItem key={key} border="none">
            <AccordionButton p="0" _hover={{ bg: "none" }}>
                <Box display="flex" justify="space-between" w="60%" mx="auto">
                    <Text
                        variant="sideBarMenuText"
                        textAlign="center"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            router.push(href ?? "");
                        }}
                    >
                        {label}
                    </Text>
                    {items && (
                        <Icon
                            as={ChevronDownIcon}
                            color="white"
                            transition={"all .25s ease-in-out"}
                            transform={isOpen ? "rotate(180deg)" : ""}
                            w={6}
                            h={6}
                            onClick={onToggle}
                        />
                    )}
                </Box>
            </AccordionButton>

            <Box my="15px">
                {items &&
                    items.map((item, index) => (
                        <AccordionPanel
                            key={"page" + index}
                            variant="aboutDescLink"
                            ml="20%"
                            color="white"
                            textAlign="left"
                            fontWeight="bold"
                            style={{ wordBreak: "break-all" }}
                            padding="3px"
                            cursor="pointer"
                            fontSize="16px"
                            width="80%"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                router.push(item.href);
                            }}
                        >
                            {item.label}
                        </AccordionPanel>
                    ))}
            </Box>
        </AccordionItem>
    );
};

export default AccordionSection;
