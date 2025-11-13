import { Textarea } from "@chakra-ui/react";
export const TextAreaField = (props) => {
    const { component, errors, value, onChange } = props;
    return (
        <Textarea
            variant="filled"
            my="1em"
            value={value}
            {...component.fieldStyle}
            onChange={(e) => {
                onChange(e);
                if (component.onChange) component.onChange(e);
            }}
        />
    );
};
