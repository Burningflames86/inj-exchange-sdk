import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import {
  QueryClient,
  QueryAccountResponse,
  QueryAccountRequest,
  QueryService,
  QueryAccountsRequest,
  QueryAccountsResponse,
} from "../../../gen/cosmos/auth/v1beta1/query";
import { ApiManager } from "../../../managers/ApiManager";
import {
  EthAccount,
  MessageFns,
} from "../../../gen/injective/types/v1beta1/account";
import { base64 } from "@scure/base";
import { PubKey } from "../../../gen/injective/crypto/v1beta1/ethsecp256k1/keys";
import { Any } from "../../../gen/google/protobuf/any";
import { BaseAccount } from "../../../gen/cosmos/auth/v1beta1/auth";
import {
  AccountResponse,
  AccountsResponse,
  SanitizedBaseAccount,
} from "../../../types/chain/auth";
import { SanitizedPageRequest } from "../../../types/chain/pagination";
import {
  createSanitizedPageResponse,
  createUnSanitizedPageRequest,
} from "../../../utils/pagination";

export class ChainAuthApiClient {
  private client: QueryClient;

  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new QueryClient(address, serverCredentials, options);
  }

  private decodeAccount<T extends { baseAccount: BaseAccount | undefined }>(
    account: Any,
    decoder: MessageFns<T>,
  ) {
    const decodedAccount = decoder.decode(account.value);
    const baseAccount = decodedAccount.baseAccount!;
    const pubKey = baseAccount.pubKey;
    const sanitizedBaseAccount: SanitizedBaseAccount = {
      address: baseAccount.address,
      pubKey: pubKey
        ? {
            key: base64.encode(PubKey.decode(pubKey.value).key),
            typeUrl: pubKey.typeUrl,
          }
        : undefined,
      accountNumber: baseAccount.accountNumber,
      sequence: baseAccount.sequence,
    };
    return {
      ...decodedAccount,
      baseAccount: sanitizedBaseAccount,
    };
  }

  public async fetchAccounts(
    params?: SanitizedPageRequest,
  ): Promise<AccountsResponse> {
    const response: QueryAccountsResponse = await ApiManager(
      this.client.accounts.bind(this.client),
      QueryAccountsRequest.create({
        pagination: createUnSanitizedPageRequest(params),
      }),
      QueryService.accounts.path,
    );
    const { accounts, pagination } = response;
    return {
      pagination: createSanitizedPageResponse(pagination),
      accounts: accounts.map((acc) => {
        const { baseAccount, codeHash } = this.decodeAccount(acc, EthAccount);
        return {
          codeHash: codeHash.toString(),
          baseAccount,
        };
      }),
    };
  }

  public async fetchAccount(address: string): Promise<AccountResponse> {
    const response: QueryAccountResponse = await ApiManager(
      this.client.account.bind(this.client),
      QueryAccountRequest.create({ address }),
      QueryService.account.path,
    );
    const { baseAccount, codeHash } = this.decodeAccount(
      response.account!,
      EthAccount,
    );
    return {
      codeHash: codeHash.toString(),
      baseAccount: baseAccount,
    };
  }
}
