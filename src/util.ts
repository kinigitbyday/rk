export function bottom<T = any>(message: never): never {
  throw new Error(`bottom hit: ${JSON.stringify(message)}`);
}
