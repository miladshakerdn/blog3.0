import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { RedisModule } from './redis/redis.module';

// import { CommonModule } from './common/common.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './modules/user/user.module';
import { UserMiddleware } from './core/middleware/user.middleware';
import { OauthModule } from './oauth/oauth.module';
import { CommentModule } from './modules/comment/comment.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { CommonModule } from './common/common.module';
import { ArticleController } from './modules/article/article.controller';
import { ArticleService } from './modules/article/article.service';
import { ArticleModule } from './modules/article/article.module';
import { TagModule } from './modules/tag/tag.module';
import { RoleService } from './modules/role/role.service';
import { RoleModule } from './modules/role/role.module';
import { LinksModule } from './modules/links/links.module';
import { OpenapiModule } from './openapi/openapi.module';

@Module({
  imports: [
    ConfigModule,
    TypegooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return configService.db;
      },
      inject: [ConfigService],
    }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: async (configService: ConfigService) => {
    //     // typeorm bug, https://github.com/nestjs/nest/issues/1119
    //     // 将 type 定义为 type: 'mysql' | 'mariadb'; 解决此issue
    //     return configService.db;
    //   },
    //   inject: [ConfigService],
    // }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService): Promise<ConfigService> => {
        return configService;
      },
      inject: [ConfigService],
    }),
    CommonModule,
    OauthModule,
    UserModule,
    CommentModule,
    ArticleModule,
    TagModule,
    RoleModule,
    LinksModule,
    OpenapiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) { }

  configure(consumer: MiddlewareConsumer) {
    const middlewares = [
      UserMiddleware
    ];
    consumer
      .apply(...middlewares)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
