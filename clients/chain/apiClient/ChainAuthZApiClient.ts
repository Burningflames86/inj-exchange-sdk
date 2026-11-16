import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import {
  QueryClient,
  QueryGranteeGrantsRequest,
  QueryGranteeGrantsResponse,
  QueryGranterGrantsRequest,
  QueryGranterGrantsResponse,
  QueryGrantsRequest,
  QueryGrantsResponse,
  QueryService,
} from "../../../gen/cosmos/authz/v1beta1/query";
import { ApiManager } from "../../../managers/ApiManager";
import { base64 } from "@scure/base";
import {
  GenericAuthorization,
  Grant,
} from "../../../gen/cosmos/authz/v1beta1/authz";
import {
  SanitzedGranteeGrant,
  SantizedGrant,
  SantizedGranterGrant,
} from "../../../types/chain/authz";
import {
  SanitizedPageRequest,
  SanitizedPageResponse,
} from "../../../types/chain/pagination";
import {
  createSanitizedPageResponse,
  createUnSanitizedPageRequest,
} from "../../../utils/pagination";

export class ChainAuthZApiClient {
  private client: QueryClient;

  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new QueryClient(address, serverCredentials, options);
  }

  private sanitizeGrant(grant: Grant): SantizedGrant {
    return {
      authorization: grant.authorization
        ? { msg: GenericAuthorization.decode(grant.authorization.value).msg }
        : undefined,
      expiration: new Date(grant.expiration || 0).getTime() / 1000,
      authorizationType: grant.authorization?.typeUrl || "",
    };
  }

  public async fetchGrants(
    params: Omit<QueryGrantsRequest, "msgTypeUrl" | "pagination"> & {
      msgTypeUrl?: string;
      pagination?: SanitizedPageRequest; // same datatype available in ChainAuthApiClient.ts, merge them later on
    },
  ): Promise<{
    grants: SantizedGrant[];
    pagination: SanitizedPageResponse; //Same kind of type and code logic available in ChainAuthApiClien.ts as well, merge them later on
  }> {
    const { pagination } = params;
    const response: QueryGrantsResponse = await ApiManager(
      this.client.grants.bind(this.client),
      QueryGrantsRequest.create({
        ...params,
        pagination: createUnSanitizedPageRequest(pagination),
      }),
      QueryService.grants.path,
    );
    return {
      grants: response.grants.map((grant) => this.sanitizeGrant(grant)),
      pagination: createSanitizedPageResponse(response.pagination),
    };
  }

  public async fetchGranterGrants(
    granter: string,
    pagination?: SanitizedPageRequest,
  ): Promise<{
    grants: SantizedGranterGrant[];
    pagination: SanitizedPageResponse; //Same kind of type and code logic available in ChainAuthApiClien.ts as well, merge them later on
  }> {
    const response: QueryGranterGrantsResponse = await ApiManager(
      this.client.granterGrants.bind(this.client),
      QueryGranterGrantsRequest.create({
        granter,
        pagination: createUnSanitizedPageRequest(pagination),
      }),
      QueryService.granterGrants.path,
    );
    return {
      grants: response.grants.map((grant) => {
        return {
          ...this.sanitizeGrant(grant),
          grantee: grant.grantee,
          granter: grant.granter,
        };
      }),
      pagination: createSanitizedPageResponse(response.pagination),
    };
  }

  // TEST IT AGAIN
  public async fetchGranteeGrants(
    grantee: string,
    pagination?: SanitizedPageRequest,
  ): Promise<{
    grants: SanitzedGranteeGrant[];
    pagination: SanitizedPageResponse; //Same kind of type and code logic available in ChainAuthApiClien.ts as well, merge them later on
  }> {
    const response: QueryGranteeGrantsResponse = await ApiManager(
      this.client.granteeGrants.bind(this.client),
      QueryGranteeGrantsRequest.create({
        grantee,
        pagination: createUnSanitizedPageRequest(pagination),
      }),
      QueryService.granteeGrants.path,
    );
    return {
      grants: response.grants.map((grant) => {
        return {
          ...this.sanitizeGrant(grant),
          grantee: grant.grantee,
          granter: grant.granter,
        };
      }),
      // pagination: {
      //   next: response.pagination?.nextKey
      //     ? base64.encode(response.pagination.nextKey)
      //     : null,
      //   total: response.pagination?.total ? response.pagination.total : 0,
      // },
      pagination: createSanitizedPageResponse(response.pagination),
    };
  }
}
