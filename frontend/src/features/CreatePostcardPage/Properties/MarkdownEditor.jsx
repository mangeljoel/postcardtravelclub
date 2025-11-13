import React, { useMemo, useRef, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { getUrlOfUploadImage, uploadImage } from "../../../services/utilities";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input
} from "@chakra-ui/react";
import { MdSmartButton } from "@chakra-ui/icons";
//import Quill from "quill";
//import { Quill } from "react-quill";
const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill");

        // eslint-disable-next-line react/display-name
        return ({ forwardedRef, ...props }) => (
            <RQ ref={forwardedRef} {...props} />
        );
    },
    {
        ssr: false
    }
);

const MarkdownEditor = (props) => {
    const { value, onChange, onBlur = () => { }, display } = props;

    const editorRef = useRef(null);

    // Function to handle image uploads
    const handleImageUpload = async () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        const quill = editorRef.current.getEditor();
        const range = quill.getSelection(true);

        quill.setSelection(range.index + 1);

        input.onchange = async () => {
            const file = input.files[0];
            quill.insertEmbed(range.index, "image", "/assets/balloon.gif");
            await getUrlOfUploadImage(file, (result) => {
                if (result && result.url) {
                    quill.deleteText(range.index, 1);
                    quill.insertEmbed(range.index, "image", result.url);
                    quill.insertEmbed(range.index + 1, "block", "<p><br></p>");
                    quill.setSelection(range.index + 1);
                }
            });
        };
    };
    const handleCustomButtonClick = () => {
        const quill = editorRef.current.getEditor();

        // const range = quill.getSelection(true);
        // const editor = editorRef.current.getEditor();
        const range = quill.getSelection();
        const btnName = prompt("Enter the Button Name");
        const btnUrl = prompt("Enter the link");
        const buttonHtml = `<p><a>${btnName}</a></p>`;
        quill.clipboard.dangerouslyPasteHTML(range.index, buttonHtml, "api");
        // quill.insertEmbed(range.index, "customButton", buttonHtml);
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic"],
                    ["link"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    // ["link", "image"]
                    //  ["customButton"]
                    // ["<MdSmartButton />"]
                ],

                handlers: {
                    // image: handleImageUpload,
                    // customButton: handleCustomButtonClick
                }
            },
            clipboard: {
                matchVisual: false, // Ensures pasted content adheres to editor styles
            },
        }),
        []
    );

    useEffect(() => {
        const quill = editorRef.current?.getEditor();
        if (quill) {
            quill.root.addEventListener("paste", (event) => {
                console.log("Paste event triggered", event);
            });
        }
        return () => {
            if (quill) {
                quill.root.removeEventListener("paste", () => { });
            }
        };
    }, []);


    return (
        <ReactQuill
            {...props}
            modules={modules}
            style={{ display: display || "block", ...props.style }}
            forwardedRef={editorRef}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className="articleMarkdownStyles"
        />
    );
};

export default MarkdownEditor;
