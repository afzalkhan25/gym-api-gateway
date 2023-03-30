import { FileValidator } from "@nestjs/common/pipes/file/file-validator.interface";

export type FileExtensionValidatorOptions = {
    extensions: string[]
}
export class FileExtensionValidator extends FileValidator<FileExtensionValidatorOptions> {
    extensions: any;
    constructor(c) {
        super(c);

        this.extensions = c;

        console.log(this.extensions);
    }

    buildErrorMessage(): string {
        console.log('extensions are', typeof (this.extensions));
        return `error: only supported extensions are ${this.extensions.extensions.map((ext) => ext)}`
    };

    isValid(file: any): boolean {
        console.log(`file =>`, file);
        const originalname = file.originalname;
        const tmp = originalname.split('.');
        console.log(tmp);
        return this.extensions.extensions.includes(tmp[1]);

    };
}
