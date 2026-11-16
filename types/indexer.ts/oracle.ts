interface PricePayload {
  baseSymbol: string;
  quoteSymbol: string;
  oracleType: string;
  oracleScaleFactor?: number;
}
