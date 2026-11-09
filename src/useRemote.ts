import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
export function useRemote<T>(path: string, revision = 0) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const reload = useCallback(() => setRetry((n) => n + 1), []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api<T>(path)
      .then((value) => {
        if (active) setData(value);
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          setData(undefined);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [path, revision, retry]);
  return { data, loading, error, reload };
}
