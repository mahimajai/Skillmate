import pino from "pino";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

function resolvePretty() {
  if (process.env.NODE_ENV === "production") return undefined;
  try {
    require.resolve("pino-pretty");
    return { target: "pino-pretty", options: { colorize: true } } as any;
  } catch {
    return undefined;
  }
}

export const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  transport: resolvePretty(),
});
