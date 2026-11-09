import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
export function useRemote<T>(query: string, variables: object = {}, revision = 0) {
  const variablesKey = JSON.stringify(variables);
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const reload = useCallback(() => setRetry((n) => n + 1), []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api<T>(query, JSON.parse(variablesKey))
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
  }, [query, variablesKey, revision, retry]);
  return { data, loading, error, reload };
}
