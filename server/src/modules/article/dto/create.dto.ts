import { IsString, Length, IsArray, IsMongoId, ValidateIf, MinLength, IsUrl, IsUUID } from "class-validator";
import { ErrorCode } from "../../../constants/error";
import { ApiProperty } from "@nestjs/swagger";


export class CreateArticleDto {
  @IsString({ message: ErrorCode.ParamsError.MESSAGE })
  @Length(1, 200, { message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "title" })
  title: string;

  @ValidateIf(o => typeof o.coverUrl === 'string' && o.coverUrl.length)
  @IsUrl({
    protocols: ['https'],
    require_protocol: false,
  }, { message: "图片必须为url" })
  @ApiProperty({ description: "coverUrl" })
  coverUrl: string

  // @ApiProperty({ description: "summary" })
  // @Length(0, 200, { message: ErrorCode.ParamsError.MESSAGE })
  // summary: string

  @IsString({ message: ErrorCode.ParamsError.MESSAGE })
  @MinLength(1, { message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "content" })
  content: string;

  // @IsString({ message: ErrorCode.ParamsError.MESSAGE })
  // @MinLength(1, { message: ErrorCode.ParamsError.MESSAGE })
  // @ApiProperty({ description: "htmlContent" })
  // htmlContent: string;

  @ValidateIf(o => Array.isArray(o.tags))
  @IsUUID("4", { each: true, message: ErrorCode.ParamsError.MESSAGE })
  @ApiProperty({ description: "tags" })
  tags: string[]
}