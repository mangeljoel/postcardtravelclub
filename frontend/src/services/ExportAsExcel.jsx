import { Button } from "@chakra-ui/react";
import React from "react";
import * as XLSX from "xlsx";

const ExportAsExcel = (props) => {
    const { csvData, fileName, buttonName, sheetName, fileType } = props;
    const exportToCSV = (csvData, fileName, sheetName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);

        const wb = { Sheets: { [sheetName]: ws }, SheetNames: [sheetName] };
        const excelBuffer = XLSX.write(wb, {
            bookType: fileType,
            type: "array"
        });
        const data = new Blob([excelBuffer], { type: fileType });
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(data, fileName);
        } else {
            const url = window.URL.createObjectURL(data);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <Button
            {...props}
            onClick={(e) => exportToCSV(csvData, fileName, sheetName)}
        >
            {buttonName}
        </Button>
    );
};

export default ExportAsExcel;
