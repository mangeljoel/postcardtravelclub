import { useState, useCallback } from "react";
import {
    Button,
    Flex,
    Text,
    FormControl,
    Input,
    FormErrorMessage,
    Spacer,
    Textarea,
    Select
} from "@chakra-ui/react";
import debounce from "lodash.debounce";
import { Form, Formik, Field } from "formik";
import Autocomplete from "react-autocomplete";
import * as yup from "yup";
import {
    updateDBValue,
    getCountryByWord
} from "../../../../queries/strapiQueries";
import { slugify } from "../../../../services/utilities";
import { useRouter } from "next/router";

const PageEditForm = ({ page, refetch, handleClose }) => {
    const [countryList, setCountryList] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState();
    const router = useRouter();
    const handleCountryInput = async (e) => {
        const countryList = await getCountryByWord(
            e.charAt(0).toUpperCase() + e.slice(1)
        );
        if (countryList?.data) setCountryList(countryList.data);
        else setCountryList([]);
    };
    const debouncedSave = useCallback(
        debounce((newValue, type) => {
            if (type === "isTag") handleTagInput(encodeURIComponent(newValue));
            // else if (type === "isCity") handleCityInput(newValue);
            else if (type === "isCountry") handleCountryInput(newValue);
        }, 500),

        []
    );
    const onCountryChange = (word) => {
        debouncedSave(word, "isCountry");
    };

    const PageFormValidation = yup.object().shape({
        name: yup
            .string()
            .min(1)
            .max(60)
            .required("(required*)")
            .typeError("(required*)"),
        intro: yup
            .string()
            .required("(required*)")
            .typeError("(required*)")
            .test(
                "! Check word count",
                "! Word count exceeds the limit 60",
                (value) => {
                    return checkWordCount(value, 60);
                }
            ),
        country: yup.string().min(1).required("(required*)")
    });
    const PageFormPopupValidation = yup.object().shape({
        name: yup
            .string()
            .min(1)
            .max(60)
            .required("(required*)")
            .typeError("(required*)"),
        intro: yup
            .string()
            .required("(required*)")
            .typeError("(required*)")
            .test(
                "! Check word count",
                "! Word count exceeds the limit 60",
                (value) => {
                    return checkWordCount(value, 60);
                }
            ),
        story: yup
            .string()
            .required("(required*)")
            .typeError("(required*)")
            .test(
                "! Check word count",
                "! Word count exceeds the limit 300",
                (value) => {
                    return checkWordCount(value, 300);
                }
            ),
        country: yup.string().min(1).required("(required*)")
    });
    const checkWordCount = (value, limit) => {
        if (value && value.length >= 1) {
            return value.match(/\S+/g).length <= limit;
        }
    };
    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                name: page?.name ? page?.name : "",
                intro: page?.intro ? page?.intro : "",
                story: page?.story ? page?.story : "",
                country: page?.country ? page?.country?.name : ""
            }}
            validationSchema={
                handleClose ? PageFormPopupValidation : PageFormValidation
            }
            validateOnMount={true}
            onSubmit={async (values, actions) => {
                if (!values) return;

                let data = page.slug
                    ? {
                          name: values.name,
                          intro: values.intro,
                          story: values.story,
                          country: selectedCountry
                              ? selectedCountry
                              : page?.country?.id
                      }
                    : {
                          name: values.name,
                          intro: values.intro,
                          story: values.story,
                          country: selectedCountry
                              ? selectedCountry
                              : page?.country?.id,
                          slug:
                              !page.slug && values.name
                                  ? slugify(values.name)
                                  : ""
                      };
                await updateDBValue("albums", page.id, data).then((resp) => {
                    if (resp) {
                        // refetch();
                        if (handleClose) {
                            refetch();
                            handleClose();
                        } else router.push("/" + resp.data?.slug);
                    }
                });
            }}
        >
            <Form>
                <Field name="name" key="name">
                    {({ field, form }) => (
                        <FormControl
                            isInvalid={form.errors.name || form.touched.name}
                        >
                            <Flex mt="5%" mb="8px">
                                <Text variant="formLabel">Name : &nbsp;</Text>
                                <Spacer></Spacer>
                                <Text
                                    variant={
                                        field?.value?.length >= 60
                                            ? "textExceed"
                                            : "formReq"
                                    }
                                >
                                    {field.value ? field.value.length : "0"}
                                    &nbsp;/ 60 chars
                                </Text>
                            </Flex>

                            <Input
                                {...field}
                                id="name"
                                placeholder="Enter name of the tour/hotel"
                                borderColor={
                                    form.errors.name && form.touched.name
                                        ? "#EA6147!important"
                                        : "black"
                                }
                                bg="cardBackground"
                                boxShadow={
                                    form.errors.name && form.touched.name
                                        ? "0 0 0 1px #EA6147!important"
                                        : "black"
                                }
                                onChange={(evt) => {
                                    field.onChange(evt);
                                }}
                                onBlur={(e) => {
                                    e.stopPropagation();
                                    if (e.target.value.length > 60) return;
                                    if (e.target.value) {
                                        let data = {
                                            name: e.target.value
                                        };
                                        updateDBValue("albums", page?.id, data);
                                    }
                                }}
                            />

                            <FormErrorMessage color="primary_1">
                                {form.errors.name}
                            </FormErrorMessage>
                        </FormControl>
                    )}
                </Field>
                <Field name="intro" key="intro">
                    {({ field, form }) => (
                        <FormControl
                            isInvalid={form.errors.intro || form.touched.intro}
                        >
                            <Flex mt="5%" mb="8px">
                                <Text variant="formLabel">
                                    Introduction : &nbsp;
                                </Text>
                                <Spacer></Spacer>
                                <Text
                                    variant={
                                        field.value?.match(/\S+/g)?.length >= 60
                                            ? "textExceed"
                                            : "formReq"
                                    }
                                >
                                    {field.value
                                        ? field.value?.match(/\S+/g)?.length
                                        : "0"}
                                    &nbsp;/ 60 words
                                </Text>
                            </Flex>

                            <Textarea
                                {...field}
                                id="intro"
                                bg="cardBackground"
                                rows={3}
                                placeholder="Share a small introduction about the tour/hotel"
                                borderColor={
                                    form.errors.intro && form.touched.intro
                                        ? "#EA6147!important"
                                        : "black"
                                }
                                boxShadow={
                                    form.errors.intro && form.touched.intro
                                        ? "0 0 0 1px #EA6147!important"
                                        : "black"
                                }
                                onChange={(evt) => {
                                    field.onChange(evt);
                                }}
                                onBlur={(e) => {
                                    e.stopPropagation();
                                    if (!checkWordCount(e.target.value, 60))
                                        return;
                                    if (e.target.value) {
                                        let data = {
                                            intro: e.target.value
                                        };
                                        updateDBValue("albums", page?.id, data);
                                    }
                                }}
                            />

                            <FormErrorMessage color="primary_1">
                                {form.errors.intro}
                            </FormErrorMessage>
                        </FormControl>
                    )}
                </Field>
                <Field name="story" key="story">
                    {({ field, form }) => (
                        <FormControl
                            isInvalid={form.errors.story || form.touched.story}
                        >
                            <Flex mt="5%" mb="8px">
                                <Text variant="formLabel">
                                    Back Story : &nbsp;
                                </Text>
                                <Text
                                    variant={
                                        field.value?.match(/\S+/g)?.length >=
                                        300
                                            ? "textExceed"
                                            : "formReq"
                                    }
                                >
                                    {field.value
                                        ? field.value?.match(/\S+/g)?.length
                                        : "0"}
                                    &nbsp;/ 300 words
                                </Text>
                            </Flex>

                            <Textarea
                                {...field}
                                bg="cardBackground"
                                id="story"
                                rows={7}
                                placeholder="Describe the back story about this tour/hotel"
                                borderColor={""}
                                onChange={(evt) => {
                                    field.onChange(evt);
                                }}
                                onBlur={(e) => {
                                    e.stopPropagation();
                                    if (!checkWordCount(e.target.value, 300))
                                        return;
                                    if (e.target.value) {
                                        let data = {
                                            story: e.target.value
                                        };
                                        updateDBValue("albums", page?.id, data);
                                    }
                                }}
                            />

                            <FormErrorMessage color="primary_1">
                                {form.errors.story}
                            </FormErrorMessage>
                        </FormControl>
                    )}
                </Field>
                <Field name="country">
                    {({ field, form }) => (
                        <FormControl
                            isInvalid={
                                form.errors.country || form.touched.country
                            }
                        >
                            <Flex mt="5%" mb="8px">
                                <Text variant="formLabel">
                                    Select Country : &nbsp;
                                </Text>
                            </Flex>
                            <Autocomplete
                                {...field}
                                menuStyle={{
                                    zIndex: "9999",
                                    borderWidth:
                                        countryList && countryList.length > 0
                                            ? "1px"
                                            : "trasparent",
                                    marginTop: "2px",
                                    padding: "3px",
                                    width: "100%",
                                    borderColor:
                                        countryList && countryList.length > 0
                                            ? "#f8b09d"
                                            : "trasparent",
                                    borderRadius: "8px"
                                }}
                                wrapperStyle={{
                                    width: "100%",
                                    border: "none"
                                }}
                                inputProps={{
                                    id: "country",
                                    style: {
                                        border: "1px solid",

                                        height: "38px",
                                        borderRadius: "8px",
                                        padding: "8px",
                                        width: "100%",
                                        background: "#fbf8f5",

                                        borderColor:
                                            form.errors.country &&
                                            form.touched.country
                                                ? "#EA6147"
                                                : "black",
                                        boxShadow:
                                            form.errors.country &&
                                            form.touched.country
                                                ? "0 0 0 1px #EA6147"
                                                : "black"
                                    },
                                    placeholder: "Select Country"
                                }}
                                getItemValue={(item) => item.name}
                                items={countryList}
                                renderItem={(item, isHighlighted) => (
                                    <div
                                        style={{
                                            borderWidth: "0px",
                                            background: isHighlighted
                                                ? "#f8b09d"
                                                : "white",
                                            zIndex: "9999",
                                            padding: "2px"
                                        }}
                                    >
                                        {item.name}
                                    </div>
                                )}
                                onChange={(e) => {
                                    field.onChange(e);

                                    if (e.target.value)
                                        onCountryChange(e.target.value);
                                }}
                                onSelect={(val, item) => {
                                    let sel = countryList.find(
                                        (cnt) => cnt.name === val.toString()
                                    )?.id;
                                    setSelectedCountry(sel);
                                    //console.log(sel);
                                    form.setFieldValue("country", val);
                                }}
                            />
                            <FormErrorMessage color="primary_1">
                                {form.errors.country}
                            </FormErrorMessage>
                        </FormControl>
                    )}
                </Field>
                <Field name="name" key="name">
                    {({ field, form }) => (
                        <Button
                            type="submit"
                            isLoading={form.isSubmitting}
                            my="2em"
                        >
                            Save & Close
                        </Button>
                    )}
                </Field>
            </Form>
        </Formik>
    );
};
export default PageEditForm;
