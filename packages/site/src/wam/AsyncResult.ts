import { useEffect, useState } from "react";

export type AsyncResult<T> =
  | {
      status: "pending";
    }
  | { status: "ready"; value: T }
  | { status: "error"; error: Error };

export const asyncResult = {
  pending<T>(): AsyncResult<T> {
    return { status: "pending" } as const;
  },
  ready<T>(value: T) {
    return { status: "ready", value } as const;
  },
  error(error: unknown) {
    return { status: "error", error: ensureError(error) } as const;
  },
};

export function useAsyncResult<T>(promise: Promise<T> | null): AsyncResult<T> {
  const [status, setStatus] = useState<AsyncResult<T>>({
    status: "pending",
  });
  useEffect(() => {
    if (promise == null) {
      return;
    }
    promise
      .then((value) => {
        setStatus({ status: "ready", value });
      })
      .catch((error) => {
        setStatus({ status: "error", error: ensureError(error) });
      });
  }, [promise]);
  return status;
}

export function ensureError(e: unknown): Error {
  if (e instanceof Error) {
    return e;
  } else if (typeof e === "string") {
    return new Error(e);
  } else {
    return new Error(String(e), { cause: e });
  }
}
