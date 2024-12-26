export type AuthConfig = {
  jwt: {
    accessToken: {
      secretKey: string;
      expirationTime: number;
    };
    refreshToken: {
      secretKey: string;
      expirationTime: number;
    };
    subject: string;
    audience: string;
    issuer: string;
    prefixAuthorization: string;
  };
  password: {
    saltLength: number;
    expiredIn: number;
    expiredInTemporary: number;
    period: number;
  };
};
