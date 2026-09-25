/** biome-ignore-all lint/suspicious/noExplicitAny: REQUIRED */

type MessageInstance<TArgs extends any[] = any[]> = {
  interpolation?: (params: string[]) => Record<string, string | number | Date>;
  construct: (...args: TArgs) => string;
};

export class ErrorTranslation<
  TRegisteredKey extends string,
  TMap extends Record<TRegisteredKey, MessageInstance>,
> {
  public static groupSeparator = "\x1d" as const;
  public static unitSeparator = "\x1f" as const;

  public messages: TMap;

  constructor(opts: { messages: TMap }) {
    this.messages = opts.messages;
  }

  public static init<TKey extends string>() {
    return <TMap extends Record<TKey, MessageInstance>>(opts: {
      messages: TMap;
    }) => new ErrorTranslation<TKey, TMap>(opts);
  }

  public static createSerializer<TRegisteredKey extends string>() {
    return (opts: { key: TRegisteredKey; params?: unknown[] }) => {
      const params = opts.params ?? [];
      return [
        // KEY [0]
        opts.key,

        // PARAMS [>0]
        params.join(ErrorTranslation.unitSeparator),
      ].join(ErrorTranslation.groupSeparator);
    };
  }

  public static createDeserializer<TRegisteredKey extends string>(
    messages: Record<TRegisteredKey, MessageInstance>,
  ) {
    return (proto: string) => {
      const groups = proto.split(ErrorTranslation.groupSeparator);

      const [key, _params] = groups.filter(Boolean);

      const [_, instance] =
        (Object.entries(messages) as [TRegisteredKey, MessageInstance][]).find(
          ([k]) => k === key,
        ) ?? [];

      if (!instance) {
        throw new Error(
          `${proto} is an invalid proto, or unhandled key. No message instance found.`,
        );
      }

      const raw_params = _params
        ? _params.split(ErrorTranslation.unitSeparator)
        : [];

      let params: Record<string, string | number | Date> = {};

      if (raw_params.length) {
        if (!instance?.interpolation) {
          throw new Error(
            `Proto provide a parameter but interpolation is not defined for message with key: ${key}`,
          );
        }

        params = instance.interpolation(raw_params);
      }

      return { key: key as TRegisteredKey, params };
    };
  }
  public static createProtoValidator<TRegisteredKey extends string>(
    messages: Record<TRegisteredKey, MessageInstance>,
  ) {
    const pool = new Map(
      Object.entries(messages) as [TRegisteredKey, MessageInstance][],
    );
    return (proto: string): boolean => {
      const [key, _params] = proto.split(ErrorTranslation.groupSeparator);

      const params = _params
        ? _params?.split(ErrorTranslation.unitSeparator)
        : [];

      const instance = pool.get(key as TRegisteredKey);

      if (!instance) return false;

      if (instance?.interpolation && !params.length) return false;

      if (params.length) {
        try {
          if (!instance?.interpolation) {
            return false;
          }

          instance?.interpolation?.(params);
          return true;
        } catch (_error) {
          return false;
        }
      } else {
        return true;
      }
    };
  }
}
