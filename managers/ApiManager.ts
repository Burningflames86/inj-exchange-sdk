import { ClientUnaryCall, ServiceError } from "@grpc/grpc-js";
import { ApiError } from "../types/managers/api";

type UnaryType<UnaryRequest, UnaryResponse> = (
  req: UnaryRequest,
  callback: (err: ServiceError | null, response: UnaryResponse) => void,
) => ClientUnaryCall;

export async function ApiManager<UnaryRequest, UnaryResponse>(
  un: UnaryType<UnaryRequest, UnaryResponse>,
  req: UnaryRequest,
  path: string,
) {
  return new Promise<UnaryResponse>((res, rej) =>
    un(req, (err, resp) => {
      if (err) rej(new ApiError(err, path));
      res(resp);
    }),
  );
}
