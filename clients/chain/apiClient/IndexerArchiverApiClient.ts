import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import {
  AccountStatsRequest,
  AccountStatsResponse,
  BalanceRequest,
  BalanceResponse,
  DenomHoldersRequest,
  DenomHoldersResponse,
  InjectiveArchiverRPCClient,
  InjectiveArchiverRPCService,
  PnlLeaderboardFixedResolutionRequest,
  PnlLeaderboardFixedResolutionResponse,
  PnlLeaderboardRequest,
  PnlLeaderboardResponse,
  RpnlRequest,
  RpnlResponse,
  VolLeaderboardFixedResolutionRequest,
  VolLeaderboardFixedResolutionResponse,
  VolLeaderboardRequest,
  VolLeaderboardResponse,
  VolumesRequest,
  VolumesResponse,
} from "../../../gen/exchange/injective_archiver_rpc";
import { ApiManager } from "../../../managers/ApiManager";

export class IndexerArchiverApiClient {
  private client: InjectiveArchiverRPCClient;

  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new InjectiveArchiverRPCClient(
      address,
      serverCredentials,
      options,
    );
  }

  public async fetchPnlLeaderboard(params: {
    startDate: number;
    endDate: number;
    limit?: number;
    account?: string;
  }): Promise<PnlLeaderboardResponse> {
    const response: PnlLeaderboardResponse = await ApiManager(
      this.client.pnlLeaderboard.bind(this.client),
      PnlLeaderboardRequest.create(params),
      InjectiveArchiverRPCService.pnlLeaderboard.path,
    );
    return response;
  }

  public async fetchVolLeaderboard(params: {
    startDate: number;
    endDate: number;
    limit?: number;
    account?: string;
  }): Promise<VolLeaderboardResponse> {
    const response: VolLeaderboardResponse = await ApiManager(
      this.client.volLeaderboard.bind(this.client),
      VolLeaderboardRequest.create(params),
      InjectiveArchiverRPCService.volLeaderboard.path,
    );
    return response;
  }

  public async fetchPnlLeaderboardFixedResolution(params: {
    resolution: string;
    limit?: number;
    account?: string;
  }): Promise<PnlLeaderboardFixedResolutionResponse> {
    const response: PnlLeaderboardFixedResolutionResponse = await ApiManager(
      this.client.pnlLeaderboardFixedResolution.bind(this.client),
      PnlLeaderboardFixedResolutionRequest.create(params),
      InjectiveArchiverRPCService.pnlLeaderboardFixedResolution.path,
    );
    return response;
  }

  public async fetchVolLeaderboardFixedResolution(params: {
    resolution: string;
    limit?: number;
    account?: string;
  }): Promise<VolLeaderboardFixedResolutionResponse> {
    const response: VolLeaderboardFixedResolutionResponse = await ApiManager(
      this.client.volLeaderboardFixedResolution.bind(this.client),
      VolLeaderboardFixedResolutionRequest.create(params),
      InjectiveArchiverRPCService.volLeaderboardFixedResolution.path,
    );
    return response;
  }

  public async fetchHistoricalBalance(params: {
    account: string;
    resolution: string;
  }): Promise<BalanceResponse> {
    const response: BalanceResponse = await ApiManager(
      this.client.balance.bind(this.client),
      BalanceRequest.create(params),
      InjectiveArchiverRPCService.balance.path,
    );
    return response;
  }

  public async fetchHistoricalRpnl(params: {
    account: string;
    resolution: string;
  }): Promise<RpnlResponse> {
    const response: RpnlResponse = await ApiManager(
      this.client.rpnl.bind(this.client),
      RpnlRequest.create(params),
      InjectiveArchiverRPCService.rpnl.path,
    );
    return response;
  }

  public async fetchHistoricalVolumes(params: {
    account: string;
    resolution: string;
  }): Promise<VolumesResponse> {
    const response: VolumesResponse = await ApiManager(
      this.client.volumes.bind(this.client),
      VolumesRequest.create(params),
      InjectiveArchiverRPCService.volumes.path,
    );
    return response;
  }

  public async fetchAccountStats(params: {
    account: string;
    period?: string;
  }): Promise<AccountStatsResponse> {
    const response: AccountStatsResponse = await ApiManager(
      this.client.accountStats.bind(this.client),
      AccountStatsRequest.create(params),
      InjectiveArchiverRPCService.accountStats.path,
    );
    return response;
  }

  public async fetchDenomHolders(params: {
    denom: string;
    token?: string;
    limit?: number;
  }): Promise<DenomHoldersResponse> {
    const response: DenomHoldersResponse = await ApiManager(
      this.client.denomHolders.bind(this.client),
      DenomHoldersRequest.create(params),
      InjectiveArchiverRPCService.denomHolders.path,
    );
    return response;
  }
}
