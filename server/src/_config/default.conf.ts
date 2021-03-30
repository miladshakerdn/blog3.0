import * as path from 'path';

const domain = '127.0.0.1';
const port = 9905;
const url = `http://${domain}`; 

const staticURL = `https://image.notbucai.com`; // 静态资源域名配置

export default {
    db: {
        // type: 'mongodb',
        // host: 'localhost',
        // port: 27017,
        // // charset: 'utf8mb4',
        // username: '',
        // password: '',
        // database: 'blog3',
        // synchronize: false,
        // entities: [path.join(__dirname, '../entity/**/*.entity{.ts,.js}')],
        // useUnifiedTopology: true,
        // logging: 'all', // query, error, schema, warn, info, log, all
        // logger: 'simple-console',
        // maxQueryExecutionTime: 500, // 单位毫秒
        uri: "mongodb://localhost/blog3",
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    },
    redis: {
        host: '127.0.0.1',
        port: 6379,
        keyPrefix: 'blog:',
        family: 4, // 4 (IPv4) or 6 (IPv6)
        password: '',
        db: 0,
    },
    static: {
        staticURL,
        imgPath: `${staticURL}`,
        imgFormat: ['jpg', 'jpeg', 'png', 'gif'],
        imgMaxSize: 3 * 1024 * 1024,
        imgMaxSizeError: '图片大小不能超过%sM',
        userLevelChapterURL: 'https://www.golang123.com/books/90/chapters/1515', // 用户等级在《如何使用米粒社区》中的章节url
    },
    /**
     * 腾讯cos配置
     */
    cos: {
        SecretId: '',
        SecretKey: '',
        Bucket: "",
        Region: "",
    },
    /**
    * 腾讯sms配置
    */
    sms: {
        AppID: "",
        appkey: "",
        templateIds: {
            code: "", // 验证码模版id
        },
        smsSign: ""
    },

    email: {
        host: "",
        port: 465,
        secure: true,
        auth: {
            user: '', // 账号
            pass: '' // 密码
        }
    },

    server: {
        // 一些基础信息目前没用
        siteName: '不才的博客',
        companyName: '北京xxxxxxx有限公司',
        icp: '京ICP备12345678号',
        email: "bucai_o@qq.com",
        url,
        domain,
        allowOrigins: [],
        port,
        apiPrefix: '/api/v1',
        passSalt: '123456',
        tokenName: 'authorization',
        tokenSecret: '123456',
        tokenMaxAge: 7 * 24 * 60 * 60 * 1000, // token多久过期，单位毫秒
        cookieSecret: '123456',
        rateLimitWindowMs: 15 * 60 * 1000, // 时间窗口，单位毫秒
        rateLimitMax: 1000, // limit each IP to rateLimitMax requests per windowMs
        swaggerPrefix: 'doc/v1'
    },
    // GeeTest 极验验证
    geetestCaptcha: {
        geetest_id: '',
        geetest_key: '',
    },
    /**
     * github oauth2登陆配置
     */
    github: {
        clientID: '',
        clientSecret: '',
        // authorizeURL: 'https://github.com/login/oauth/authorize?scope=user&client_id=%s',
        accessTokenURL: 'https://github.com/login/oauth/access_token',
        userInfoURL: 'https://api.github.com/user',
    },
    /**
     * github oauth2登陆配置
     */
    baidu: {
        clientID: '',
        clientSecret: '',
        // authorizeURL: 'https://github.com/login/oauth/authorize?scope=user&client_id=%s',
        accessTokenURL: 'https://openapi.baidu.com/oauth/2.0/token',
        userInfoURL: 'https://openapi.baidu.com/passport/users/getLoggedInUser',
    },
};
