import { useState, useEffect } from 'react';

type FetchProps = {
  action: (user_id: string) => Promise<any>;
  user_id: string;
};

export const useFetch = <T,>({ action, user_id }: FetchProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchData = async () => {
    setIsLoading(true);

    const result = await action(user_id);

    if (result.error) {
      setError(result.error.message);
    }

    if (result.data) {
      setData(result.data);
    }
    if (result.totalResults) {
      setTotalResults(result.totalResults);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    //eslint-disable-next-line
  }, []);

  return { isLoading, data, error, totalResults };
};
