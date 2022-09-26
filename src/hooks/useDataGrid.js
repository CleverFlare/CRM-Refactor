import { useEffect, useState } from "react";

const useDataGrid = ({ onParamsChange = () => {} }) => {
  const [requestParams, setRequestParams] = useState({
    currentPage: [["page", 1]],
  });

  useEffect(() => {
    const urlParams = new URLSearchParams();

    Object.values(requestParams).map((item) =>
      item.map(([key, value]) => urlParams.append(key, value))
    );

    onParamsChange(urlParams);
  }, [requestParams]);

  const handlePaginate = (params) => {
    setRequestParams((old) => ({
      ...old,
      currentPage: [["page", params.current]],
    }));
  };

  const handleChecks = ({ checks }) => {
    setSelected(checks);
  };

  const handleChangeAmount = ({ value }) => {
    setRequestParams((old) => ({
      ...old,
      currentPage: [["page", 1]],
      amount: [["size", value]],
    }));
  };

  const handleFilter = (filters) => {
    setRequestParams((old) => ({
      ...old,
      filters: filters.map(({ query }) => query),
    }));
  };

  return {
    handlePaginate,
    handleChecks,
    handleChangeAmount,
    handleFilter,
    requestParams,
  };
};

export default useDataGrid;
