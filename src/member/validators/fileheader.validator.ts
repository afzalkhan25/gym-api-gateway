import { FileValidator } from "@nestjs/common/pipes/file/file-validator.interface";

export type FileHeaderValidatorOptions = {
    headers: string[]
}
export class FileHeaderValidator extends FileValidator<FileHeaderValidatorOptions> {

    headers: any;
    constructor(c) {
        super(c);
        this.headers = c;
    }

    buildErrorMessage(): string {
        return `error: header is missing`
    };

    isValid(file: any): boolean {
        console.log(file);
        console.log('headers=>', this.headers);
        //todo: business logic to read headers using XLSX and returning header;
        return false;
    };
}
