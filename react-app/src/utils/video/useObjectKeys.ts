import { useCallback, useEffect, useState } from "react";
import { ComboboxData, ComboboxItem } from "@mantine/core";
import { fetchObjectKeys } from "../aws/s3Util";

interface Props {
  selectedDate: ComboboxItem | null,
  selectedUser: ComboboxItem | null,
}

interface ReturnProps {
  objectKeys: ComboboxData,
  onGetObjectKeys: () => void;
}

// userを受け取って、ユーザーの動画一覧を取得する。
export const useObjectKeys = ({selectedDate, selectedUser}: Props): ReturnProps => {
  const [ objectKeys, setOptions ] = useState<ComboboxData>([]);

  // 選択したユーザー名のPrefixがついたS3ファイルKeyの一覧を取得
  const onGetObjectKeys = useCallback(async () => {
    if (!selectedUser) return;

    const filteredKeys = await fetchObjectKeys(selectedUser.value);
    setOptions(filteredKeys!);

  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser) setOptions([]);
  }, [selectedUser]);

  return { objectKeys, onGetObjectKeys };
}
