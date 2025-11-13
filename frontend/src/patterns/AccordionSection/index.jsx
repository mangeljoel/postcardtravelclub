import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box
} from "@chakra-ui/react";
const AccordionSection = (props) => {
    const { data, defaultIndex } = props;
    return (
        <Accordion allowToggle defaultIndex={[defaultIndex]} {...props}>
            {data &&
                data.length >= 1 &&
                data.map((item, index) => (
                    <AccordionItem key={index + "acc_item"}>
                        <h2>
                            <AccordionButton>
                                <Box as="span" flex="1" textAlign="left">
                                    {item.title}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>{item.panel}</AccordionPanel>
                    </AccordionItem>
                ))}
        </Accordion>
    );
};
export default AccordionSection;
