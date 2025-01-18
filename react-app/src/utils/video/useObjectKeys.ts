import { useCallback, useEffect, useState } from "react";
import { ComboboxItem } from "@mantine/core";
import { SelectBoxOption } from "../../consts/consts";
import { fetchObjectKeys } from "../s3/s3Utils";

interface Props {
  selectedDate: ComboboxItem | null,
  selectedUser: ComboboxItem | null,
  isCorrectPass: boolean,
}

interface ReturnProps {
  objectKeys: SelectBoxOption[],
  onGetObjectKeys: () => void;
}

// userを受け取って、ユーザーの動画一覧を取得する。
export const useObjectKeys = ({selectedDate, selectedUser, isCorrectPass}: Props): ReturnProps => {
  const [ objectKeys, setOptions ] = useState<SelectBoxOption[]>([]);

  // セレクトボックスのKeyの一覧を作成
  const onGetObjectKeys = useCallback(() => {
    if (!selectedUser || !isCorrectPass) return;

    const fetchKeys = async () => {
      const filteredOptions = await fetchObjectKeys(selectedUser.value);
      setOptions(filteredOptions);
    }
    fetchKeys();

  }, [selectedUser, isCorrectPass]);

  useEffect(() => {
    if (!selectedUser || !isCorrectPass) {
      setOptions([]);
      return;
    }
  }, [isCorrectPass, selectedUser]);

  return { objectKeys, onGetObjectKeys };
}
