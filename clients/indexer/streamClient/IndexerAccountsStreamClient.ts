import { ChannelCredentials, credentials, ChannelOptions } from "@grpc/grpc-js";

import { StreamManager } from "../../../managers/StreamManager";
import {
  InjectiveAccountsRPCClient,
  StreamSubaccountBalanceRequest,
  StreamSubaccountBalanceResponse,
  InjectiveAccountsRPCService,
} from "../../../gen/exchange/injective_accounts_rpc";

export class IndexerAccountsStreamClient {
  private client: InjectiveAccountsRPCClient;
  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new InjectiveAccountsRPCClient(
      address,
      serverCredentials,
      options,
    );
  }

  public streamSubaccountBalance(
    params: Pick<StreamSubaccountBalanceRequest, "subaccountId"> &
      Partial<StreamSubaccountBalanceRequest>,
  ): StreamManager<StreamSubaccountBalanceResponse> {
    const streamFactory = () =>
      this.client.streamSubaccountBalance(
        StreamSubaccountBalanceRequest.create(params),
      );
    return new StreamManager(
      streamFactory,
      InjectiveAccountsRPCService.streamSubaccountBalance.path,
    );
  }
}
