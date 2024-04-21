declare namespace NodeJS {
  export interface ProcessEnv {
    PORT?: string;
    PORT_DB?: string;
    HOST?: string;
    PASSWORD?: string;
    USERNAME?: string;
    DATABASE?: string;
    SECRET_COOKIE?: string;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;
    FRONTEND_DOMAIN: string;
  }
}
