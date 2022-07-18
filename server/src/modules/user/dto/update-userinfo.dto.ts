import {
    IsUrl, IsString, MinLength, MaxLength, ValidateIf,
} from 'class-validator';
import { ErrorCode } from '../../../constants/error';
import { UserConstants } from '../../../constants/constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInfoDto {
    // 传了 username 字段的话，才对 username 进行检验
    @ValidateIf(obj => {
        return obj && typeof obj.username !== 'undefined';
    })
    @MinLength(UserConstants.USERNAME_MIN_LENGTH, {
        message: '用户名最少为 $constraint1 个字符',
    })
    @MaxLength(UserConstants.USERNAME_MAX_LENGTH, {
        message: '用户名不能超过 $constraint1 个字符',
    })
    @IsString({
        message: ErrorCode.ParamsError.MESSAGE,
        context: {
            errorCode: ErrorCode.ParamsError.CODE,
        },
    })
    @ApiProperty({ description: '用户名', example: '不才' })
    readonly username: string;

    @ValidateIf(obj => {
        return obj && typeof obj.job !== 'undefined';
    })
    @MinLength(UserConstants.JOB_MIN_LENGTH, {
        message: '职位最少为 $constraint1 个字符',
    })
    @MaxLength(UserConstants.JOB_MAX_LENGTH, {
        message: '职位不能超过 $constraint1 个字符',
    })
    @IsString({
        message: ErrorCode.ParamsError.MESSAGE,
        context: {
            errorCode: ErrorCode.ParamsError.CODE,
        },
    })
    @ApiProperty({ description: '职位', example: '无' })
    readonly job: string;

    @ValidateIf(obj => {
        return obj && typeof obj.company !== 'undefined';
    })
    @MinLength(UserConstants.COMPANY_MIN_LENGTH, {
        message: '公司最少为 $constraint1 个字符',
    })
    @MaxLength(UserConstants.COMPANY_MAX_LENGTH, {
        message: '公司不能超过 $constraint1 个字符',
    })
    @IsString({
        message: ErrorCode.ParamsError.MESSAGE,
        context: {
            errorCode: ErrorCode.ParamsError.CODE,
        },
    })
    @ApiProperty({ description: '公司名', example: '无' })
    readonly company: string;

    @ValidateIf(obj => {
        return obj && typeof obj.introduce !== 'undefined';
    })
    @MinLength(UserConstants.INTRODUCE_MIN_LENGTH, {
        message: '个人介绍最少为 $constraint1 个字符',
    })
    @MaxLength(UserConstants.INTRODUCE_MAX_LENGTH, {
        message: '个人介绍不能超过 $constraint1 个字符',
    })
    @IsString({
        message: ErrorCode.ParamsError.MESSAGE,
        context: {
            errorCode: ErrorCode.ParamsError.CODE,
        },
    })
    @ApiProperty({ description: '个人介绍', example: '无' })
    readonly introduce: string;

    // personalHomePage为空字符串时，可以保存到数据库
    @ValidateIf(obj => {
        return obj && typeof obj.personalHomePage !== 'undefined' && obj.personalHomePage !== '';
    })
    @MinLength(UserConstants.PERSONAL_HOMEPAGE_MIN_LENGTH, {
        message: '个人主页最少为 $constraint1 个字符',
    })
    @MaxLength(UserConstants.PERSONAL_HOMEPAGE__MAX_LENGTH, {
        message: '个人主页不能超过 $constraint1 个字符',
    })
    @IsUrl({
        protocols: ['https', 'http'],
        require_protocol: true,
    })
    @ApiProperty({ description: '个人主页', example: '无' })
    readonly personalHomePage: string;

    @ValidateIf(obj => {
        return obj && typeof obj.avatarUrl !== 'undefined';
    })
    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    })
    @ApiProperty({ description: '头像', example: '无' })
    readonly avatarUrl: string;
}