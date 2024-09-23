import { useState, useEffect, useCallback } from 'react';

type FetchProps<T> = {
  action: (user_id: string) => Promise<any>;
  user_id: string;
  initialFetch?: boolean;
};

export const useFetch = <T>({
  action,
  user_id,
  initialFetch = false,
}: FetchProps<T>) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchData = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await action(userId);
        const numOfResults = parseInt(result.totalResults);

        if (result.error) {
          setError(result.error.message as Error);
        } else {
          setData(result.data);
          setTotalResults(numOfResults);
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [action]
  );

  useEffect(() => {
    if (initialFetch) {
      fetchData(user_id);
    }
  }, [fetchData, initialFetch, user_id]);

  return { fetchData, isLoading, data, error, totalResults };
};
