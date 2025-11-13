import { useContext } from "react";
import { getCountries, updateProfile } from "../../queries/strapiQueries";
import { getCountryList } from "../../services/utilities";
import AppContext from "../AppContext";
import { useRouter } from "next/router";

export const makeConfig = (editData) => {
    const { countryList, logOut, updateUser } = useContext(AppContext);
    const router = useRouter();
    return {
        initialValues: {
            fullname: editData?.fullName ? editData.fullName : "",
            firstname: editData?.firstName ? editData.firstName : "",
            lastname: editData?.lastName ? editData.lastName : "",
            email: editData?.email ? editData?.email : "",
            country: editData?.country ? editData?.country : "",
            cityname: editData?.city ? editData?.city : "",
            bio: editData?.bio ? editData?.bio : ""
        },
        formBaseStyle: {
            // mx: ["2em", "5em"],
            py: "1em",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            borderRadius: "8px",
            bg: "primary_15"
        },
        formSectionStyle: {
            px: 4
        },
        formSectionTitleStyle: {
            variant: "profileHeading"
        },

        onSubmit: (values) => {
            let data = {
                fullName: values.fullname
                    ? values.firstname + " " + values.lastname
                    : "",
                firstName: values.firstname ? values.firstname : "",
                lastName: values.lastname ? values.lastname : "",
                bio: values.bio ? values.bio : "",
                country: values.country ? values.country.id : null,
                city: values.cityname ? values.cityname : ""
            };

            updateProfile(editData.id, data)
                .then(() => {
                    // onClose();
                    updateUser();
                    router.push("/" + editData?.slug);
                })
                .catch((error) => {
                    if (error.error.status.toString() === "403" || "401") {
                        logOut();
                    }
                });
        },
        formSection: [
            {
                //   title: "Personal Information",
                numberOfColumns: [1, 2],
                formComponents: [
                    {
                        component: "input",
                        label: "firstname",
                        name: "First Name",
                        required: true,
                        isVisible: true,
                        placeholder: "Enter First Name",
                        onChange: (e) => {
                            //console.log(e.target.value);
                        },
                        rules: {
                            required: "First Name is required"
                        }
                    },
                    {
                        component: "input",
                        label: "lastname",
                        name: "Last Name",
                        required: true,
                        isVisible: true,
                        placeholder: "Enter Last Name",
                        onChange: (e) => {
                            //console.log(e.target.value);
                        },
                        rules: {
                            required: "Last Name is required"
                        }
                    }
                ]
            },
            {
                numberOfColumns: 1,
                formComponents: [
                    {
                        component: "email_input",
                        label: "email",
                        name: "Email",
                        isVisible: true,
                        // required: true,
                        placeholder: "Enter Email Address",
                        fieldStyle: {
                            width: ["100%", "50%"],
                            isDisabled: true
                        }
                        // rules: {
                        //     required: "Email is required"
                        // }
                    },
                    {
                        component: "autocomplete",
                        label: "country",
                        isVisible: true,
                        name: "Country",
                        fieldStyle: {
                            width: ["100%", "50%"]
                        },
                        required: true,
                        placeholder: "Select Country",
                        options: countryList,
                        optionType: "object",
                        displayKey: "name",
                        valueKey: "id",
                        onChange: (e) => {
                            // console.log(e);
                        },
                        onSelectOption: (e) => {
                            // console.log(e, "select");
                        },
                        rules: {
                            required: "Country is required"
                        }
                    },
                    {
                        component: "input",
                        label: "cityname",
                        name: "City",
                        required: false,
                        isVisible: true,
                        fieldStyle: {
                            width: ["100%", "50%"]
                        },
                        placeholder: "Enter City Name",
                        onChange: (e) => { }
                    },
                    {
                        component: "textarea",
                        label: "bio",
                        name: "Bio",
                        required: false,
                        counter: { type: "chars", limit: 150 },
                        fieldStyle: { rows: 4 },
                        isVisible: true,
                        placeholder: "Enter Bio",
                        rules: {
                            maxLength: {
                                value: 150,
                                message: "Bio exceeds 15o characters"
                            }
                        },
                        onChange: (e) => {
                            //console.log(e.target.value);
                        }
                    }
                ]
            }
            // },
            // {
            //     //  title: "Personal Information",
            //     numberOfColumns: [1, 2],
            //     formComponents: [
            //         {
            //             component: "input",
            //             label: "fullname",
            //             name: "Full Name",
            //             required: true,
            //             isVisible: true,
            //             placeholder: "Enter Full Name",
            //             onChange: (e) => {
            //                 console.log(e.target.value);
            //             },
            //             rules: {
            //                 required: "Full Name is required"
            //             }
            //         },
            //         {
            //             component: "email_input",
            //             label: "email",
            //             name: "Email",
            //             isVisible: true,
            //             required: true,
            //             placeholder: "Enter Email Address",
            //             rules: {
            //                 required: "Email is required"
            //             }
            //         },
            //         {
            //             component: "autocomplete",
            //             label: "country",
            //             isVisible: true,
            //             name: "country",
            //             required: true,
            //             placeholder: "Select Country",
            //             options: ["India", "USA"],
            //             optionType: "string",
            //             displayKey: "name",
            //             valueKey: "id",
            //             onChange: (e) => {
            //                 console.log(e);
            //             },
            //             onSelectOption: (e) => {
            //                 console.log(e, "select");
            //             },
            //             rules: {
            //                 required: "Country is required"
            //             }
            //         }
            //     ]
            // },
            // {
            //     title: "Other Information",
            //     formComponents: [
            //         {
            //             component: "checkbox",
            //             label: "travelStyle",
            //             isVisible: true,
            //             name: "travelStyle",
            //             required: true,
            //             placeholder: "Select Travel Style",
            //             options: [
            //                 { id: 1, name: "Mindful" },
            //                 { id: 2, name: "Slow-paced" },
            //                 { id: 3, name: "Sustainable" }
            //             ],
            //             optionType: "object",
            //             displayKey: "name",
            //             valueKey: "id",
            //             onSelect: (e) => {
            //                 console.log(e);
            //             },
            //             rules: {
            //                 required: "Travel Style is required"
            //             }
            //         }
            //     ]
            // }
        ]
    };
};
