import * as url from 'url';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';
import { ConfigService } from '../../config/config.service';
import { ErrorCode } from '../../constants/error';
import { StatsD } from 'hot-shots';
import { MyRequest, MyResponse } from '../types/net';
import { LoggerService } from '../../common/logger.service';

// let localStatsD: StatsD;

@Injectable()
export class TransformResInterceptor<T> implements NestInterceptor {

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
    ) { }

    intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map(async (data) => {
            const req = context.switchToHttp().getRequest<MyRequest>();
            const res = context.switchToHttp().getResponse<MyResponse>();
            const reqEndTime = Date.now();
            const responseTime = reqEndTime - req.reqStartTime;
            this.logger.info({
                data: {
                    req: {
                        method: req.method,
                        url: req.originalUrl,
                        headers: {
                            'user-agent': req.headers['user-agent'],
                        },
                    },
                    ip: req.clientIp,
                    responseTime,
                },
            });
            if (res.isOrigin) {
                return data;
            }
            // const statsD: StatsD = this.getStatsD();
            // statsD.timing(this.getStat(req), responseTime, () => {
            // });
            if (typeof data === 'undefined' || data === null) {
                // 请求页面时进入这里
                return data;
            }
            const newData = data as any;
            // if (req.query && req.query.json === this.configService.server.viewDataSecret) {
            //     return newData;
            // }

            if (typeof newData.statusCode === 'undefined') {
                return {
                    data: newData,
                    code: ErrorCode.SUCCESS.CODE,
                    message: 'success',
                };
            }
            let code: number, message: string;
            if (ErrorCode.HasCode(newData.statusCode)) {
                code = newData.statusCode;
                message = ErrorCode.CodeToMessage(code);
            } else {
                code = ErrorCode.ERROR.CODE;
                message = ErrorCode.ERROR.MESSAGE;
            }
            return {
                code,
                message,
                data: this.configService.env === this.configService.DEVELOPMENT ? {
                    nestjs: newData.message,
                } : null,
            };
        }));
    }

    getStatsD () {
        // if (!localStatsD) {
        //     localStatsD = {};
        //     // new StatsD({
        //     //     host: this.configService.statsD.host,
        //     //     port: this.configService.statsD.port,
        //     //     prefix: this.configService.statsD.prefix,
        //     //     telegraf: this.configService.statsD.telegraf,
        //     //     protocol: this.configService.statsD.protocol,
        //     //     errorHandler: this.onStatsDError.bind(this),
        //     // });
        // }
        // return localStatsD;
    }

    getStat (req: MyRequest) {
        const pathname = url.parse(req.originalUrl).pathname;
        if (pathname === '/') {
            return req.method.toLocaleLowerCase() + '_' + '/';
        }
        let partArr = pathname.split('/');
        partArr = partArr.map(p => p.replace(/^[0-9]+$/, 'id'));
        let pathStr: string = req.method.toLocaleLowerCase() + '_' + partArr.join('/');
        if (pathStr.charAt(pathStr.length - 1) === '/') {
            pathStr = pathStr.substring(0, pathStr.length - 1);
        }
        return pathStr;
    }

    onStatsDError () {
    }
}
