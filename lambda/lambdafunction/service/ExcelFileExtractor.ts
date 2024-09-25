import {MultipartFile} from "lambda-multipart-parser";
import path from "path";
import os from "os";
import fs from "fs";
import * as XLSX from "xlsx";

export interface ExcelFileExtractor {
    jsonListsParser(file: MultipartFile): string[]
}

export abstract class BaseExcelFileExtractor implements ExcelFileExtractor {
    jsonListsParser(file: MultipartFile): string[] {

        const tempFilePath = path.join(os.tmpdir(), file.filename);
        fs.writeFileSync(tempFilePath, file.content);
        const jsonDataLists = this.excelExtractor(tempFilePath);
        fs.unlinkSync(tempFilePath);

        return jsonDataLists;
    }

    private excelExtractor(tempFilePath: string): string[] {
        const workbook = XLSX.readFile(tempFilePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        return XLSX.utils.sheet_to_json(worksheet, {header: 1});
    }

}