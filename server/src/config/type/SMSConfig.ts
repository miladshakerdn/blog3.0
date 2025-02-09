import BaseConfig from './BaseConfig';

export default class SMSConfig extends BaseConfig {

  AppID: string;
  appkey: string;
  accessKey: string;
  templateIds: {
    [key: string]: string
  };
  smsSign: string;

  constructor(cfg) {
    super(cfg);
  }
}