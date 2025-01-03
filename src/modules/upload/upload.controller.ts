import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Public } from "src/security/auth/auth.decorator";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "./multer.options";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { IMAGE } from "src/common/constants/response.constant";
import { FileUploadDto } from "./dto/file-upload.dto";

@Controller("upload")
@ApiTags("Upload")
@Public()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("image")
  @UseInterceptors(FileInterceptor("file", multerOptions()))
  @ApiConsumes("multipart/form-data")
  @ResponseMessage(IMAGE.IMAGE_UPLOAD)
  imageUpload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: ".(jpeg|jpg|png)" }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: FileUploadDto,
  ) {
    return this.uploadService.imageUpload(file, body.moduleName);
  }
}
