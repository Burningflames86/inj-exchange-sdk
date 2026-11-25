import { ServiceError } from "@grpc/grpc-js";
import { Status } from "@grpc/grpc-js/build/src/constants";
import { getServiceAndMethodFromPath } from "../utils/helper";

export class ApiError extends Error {
  private code: Status;
  private details: string;
  private serviceName: string;
  private methodName: string;
  constructor(err: ServiceError, path: string) {
    super(err.message);
    this.code = err.code;
    this.details = err.details;
    const { serviceName, methodName } = getServiceAndMethodFromPath(path);
    this.methodName = methodName;
    this.serviceName = serviceName;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
