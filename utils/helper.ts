export function getServiceAndMethodFromPath(path: string): {
  serviceName: string;
  methodName: string;
} {
  const spl = path.split("/");
  return {
    serviceName: spl[1] || "",
    methodName: spl[2] || "",
  };
}
