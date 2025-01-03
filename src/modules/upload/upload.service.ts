import { HttpStatus, Injectable } from "@nestjs/common";
import { CustomError } from "src/common/helpers/exceptions";

@Injectable()
export class UploadService {
  async imageUpload(file: any, moduleName: string) {
    try {
      if (!file) {
        throw CustomError("Image is required", HttpStatus.BAD_REQUEST);
      }

      if (!moduleName) {
        throw CustomError("moduleName is required", HttpStatus.BAD_REQUEST);
      }
      const path = { filename: `${moduleName}/${file.filename}` };
      return path;
    } catch (error) {
      throw CustomError(error.response.message, error.response.statusCode);
    }
  }
}
