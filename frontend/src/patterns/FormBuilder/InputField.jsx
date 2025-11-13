import { Input, FormControl, FormLabel } from "@chakra-ui/react";

export const InputField = (props) => {
    const { component, errors, value, onChange } = props;
    return (
        <Input
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
