import React from "react";
import { LoadingStatus } from "../../consts/types";
import { Loader } from "@mantine/core";

export const LoaderCenter: React.FC<{ status: LoadingStatus }> = React.memo(({ status }) => {
  if (status === 'loading') {
    return (
      <div className="flex justify-center ">
        <Loader color="cyan" />
      </div>
    )
  } else {
    return null;
  }
});