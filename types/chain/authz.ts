export type SantizedGrant = {
  authorization?: { msg: string };
  expiration: number;
  authorizationType: string;
};
export type SantizedGranterGrant = SantizedGrant & {
  granter: string;
  grantee: string;
};
export type SanitzedGranteeGrant = SantizedGranterGrant;
