/**
 * Деньги внутри сервиса — целые копейки. Рубли — только на входе (внешний API) и в ответах.
 */

/** Сумма из внешнего API: число или строка с числом ("250.10"). */
export function parseRub(raw: unknown): number {
  const value = typeof raw === "string" ? Number(raw.trim()) : raw;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`invalid amount: ${JSON.stringify(raw)}`);
  }
  return value;
}

/**
 * Переводит рубли в целые копейки по десятичным цифрам.
 * Так 0.29 ₽ даёт ровно 29 копеек. Доли копейки отбрасываем.
 */
export function toKop(rub: number): number {
  const [decimal, exponent = "0"] = String(rub).split("e");
  const [whole, fraction = ""] = decimal.split(".");
  const digits = whole + fraction;

  const integerLength = whole.length + Number(exponent) + 2;
  if (integerLength <= 0) return 0;

  return Number(digits.slice(0, integerLength).padEnd(integerLength, "0"));
}

/** Копейки → рубли для ответа API. */
export function fromKop(kop: number): number {
  return kop / 100;
}
