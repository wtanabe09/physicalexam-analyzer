import { useEffect, useState } from "react";
import { ComboboxItem } from "@mantine/core";
import { PASS_List } from "../../consts/consts";

interface ReturnProps {
  isCorrectPass: boolean,
}

// userを受け取って、ユーザーの動画一覧を取得する。
export const usePassword = (selectedUser: ComboboxItem, getPassword: string): ReturnProps => {
  const [isCorrectPass, setIsCorecct] = useState<boolean>(false);

  const isCorrectPassword = (userId: string, getPassword: string) => {
    return PASS_List[userId] === getPassword;
  };

  useEffect(() => {
    if(selectedUser) setIsCorecct(isCorrectPassword(selectedUser.value, getPassword));
  }, [selectedUser, getPassword]);

  return { isCorrectPass };
}
