import { AutoCompleteField } from "./AutoCompleteField";
import { CheckBoxField } from "./CheckBoxField";
import { InputField } from "./InputField";
import { TextAreaField } from "./TextAreaField";
const FormElement = (props) => {
    const { component, errors, field } = props;
    const renderFormElement = (component, field) => {
        switch (component.component) {
            case "input": {
                return <InputField component={component} {...field} />;
            }
            case "email_input": {
                return (
                    <InputField
                        type={"email"}
                        component={component}
                        {...field}
                    />
                );
            }
            case "autocomplete": {
                return <AutoCompleteField component={component} {...field} />;
            }
            case "checkbox": {
                return <CheckBoxField component={component} {...field} />;
            }
            case "textarea": {
                return <TextAreaField component={component} {...field} />;
            }
        }
    };
    return renderFormElement(component, field);
};

export default FormElement;
