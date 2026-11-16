import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import {
  QueryClient,
  QueryAccountResponse,
  QueryAccountRequest,
  QueryService,
  QueryAccountsRequest,
  QueryAccountsResponse,
  QueryAccountAddressByIDRequest,
  QueryAccountAddressByIDResponse,
  QueryParamsRequest,
  QueryParamsResponse,
  QueryModuleAccountsResponse,
  QueryModuleAccountsRequest,
  QueryModuleAccountByNameRequest,
  QueryModuleAccountByNameResponse,
  Bech32PrefixResponse,
  Bech32PrefixRequest,
  AddressBytesToStringResponse,
  AddressBytesToStringRequest,
  AddressStringToBytesResponse,
  AddressStringToBytesRequest,
  QueryAccountInfoResponse,
  QueryAccountInfoRequest,
} from "../../../gen/cosmos/auth/v1beta1/query";
import { ApiManager } from "../../../managers/ApiManager";
import {
  EthAccount,
  MessageFns,
} from "../../../gen/injective/types/v1beta1/account";
import { base64 } from "@scure/base";
import { PubKey } from "../../../gen/injective/crypto/v1beta1/ethsecp256k1/keys";
import { Any } from "../../../gen/google/protobuf/any";
import {
  BaseAccount,
  ModuleAccount,
  Params,
} from "../../../gen/cosmos/auth/v1beta1/auth";
import {
  AccountResponse,
  AccountsResponse,
  SanitizedBaseAccount,
  SanitizedModuleAccount,
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

  public async fetchAccountAddressByID(
    accountId: number,
  ): Promise<QueryAccountAddressByIDResponse["accountAddress"]> {
    const response: QueryAccountAddressByIDResponse = await ApiManager(
      this.client.accountAddressById.bind(this.client),
      QueryAccountAddressByIDRequest.create({ accountId }),
      QueryService.accountAddressById.path,
    );
    return response.accountAddress;
  }

  public async fetchParams(): Promise<Params> {
    const response: QueryParamsResponse = await ApiManager(
      this.client.params.bind(this.client),
      QueryParamsRequest.create(),
      QueryService.params.path,
    );
    return response.params!;
  }

  public async fetchModuleAccounts(): Promise<SanitizedModuleAccount[]> {
    const response: QueryModuleAccountsResponse = await ApiManager(
      this.client.moduleAccounts.bind(this.client),
      QueryModuleAccountsRequest.create(),
      QueryService.moduleAccounts.path,
    );

    return response.accounts.map((acc) =>
      this.decodeAccount(acc, ModuleAccount),
    );
  }

  public async fetchModuleAccountByName(
    name: string,
  ): Promise<SanitizedModuleAccount> {
    const response: QueryModuleAccountByNameResponse = await ApiManager(
      this.client.moduleAccountByName.bind(this.client),
      QueryModuleAccountByNameRequest.create({ name }),
      QueryService.moduleAccountByName.path,
    );
    return this.decodeAccount(response.account!, ModuleAccount);
  }

  public async fetchBech32Prefix(): Promise<
    Bech32PrefixResponse["bech32Prefix"]
  > {
    const response: Bech32PrefixResponse = await ApiManager(
      this.client.bech32Prefix.bind(this.client),
      Bech32PrefixRequest.create(),
      QueryService.moduleAccountByName.path,
    );
    return response.bech32Prefix;
  }

  public async fetchAddressBytesToString(
    address: string, //string representation of raw bytes
  ): Promise<AddressBytesToStringResponse["addressString"]> {
    const response: AddressBytesToStringResponse = await ApiManager(
      this.client.addressBytesToString.bind(this.client),
      AddressBytesToStringRequest.create({
        addressBytes: Buffer.from(base64.decode(address)),
      }),
      QueryService.moduleAccountByName.path,
    );
    return response.addressString;
  }

  public async fetchAddressStringToBytes(
    address: string,
  ): Promise<AddressStringToBytesResponse["addressBytes"]> {
    const response: AddressStringToBytesResponse = await ApiManager(
      this.client.addressStringToBytes.bind(this.client),
      AddressStringToBytesRequest.create({ addressString: address }),
      QueryService.moduleAccountByName.path,
    );
    return response.addressBytes;
  }

  public async fetchAccountInfo(
    address: string,
  ): Promise<SanitizedBaseAccount | undefined> {
    const response: QueryAccountInfoResponse = await ApiManager(
      this.client.accountInfo.bind(this.client),
      QueryAccountInfoRequest.create({ address }),
      QueryService.moduleAccountByName.path,
    );
    const info = response.info;
    if (!info) return undefined;
    const pubKey = info.pubKey
      ? {
          key: base64.encode(PubKey.decode(info.pubKey.value).key),
          typeUrl: info.pubKey.typeUrl,
        }
      : undefined;
    return {
      ...info,
      pubKey,
    };
  }
}
