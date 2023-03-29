import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileHeaderValidator implements PipeTransform {
    transform(headers: any, metadata: ArgumentMetadata) {
        //todo: logic to check headers exists in the uploaded file
        return headers.includes("firstName", 'lastName', 'email', 'mobileNo');
    }

}