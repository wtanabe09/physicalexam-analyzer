import { useCallback, useEffect, useState } from "react";
import { ComboboxItem } from "@mantine/core";
import { useS3ObjectList } from "../../utils/s3/useS3ObjectList";
import { SelectBoxOption } from "../../consts/consts";
import { formatWithPadding, getFormattedDate } from "../../utils/s3/s3Utils";

interface Props {
  selectedDate: ComboboxItem|null,
  selectedUser: ComboboxItem|null,
  isCorrectPass: boolean,
}

interface ReturnProps {
  options: SelectBoxOption[],
  onGetVideo: () => void;
}

// userを受け取って、ユーザーの動画一覧を取得する。
export const useGetVideoListButton = ({selectedDate, selectedUser, isCorrectPass}: Props): ReturnProps => {
  const [ options, setOptions ] = useState<SelectBoxOption[]>([]);
  const { objectList } = useS3ObjectList(".mp4");

  const getItemListLabels = (objectName: string) => {
    const sepalate = objectName.split('-');
    const userId = sepalate[0];
    const techniqueId = sepalate[1];
    const date = sepalate[2].slice(0, 8);
    const time = sepalate[2].slice(8);
    const itemString = `U${userId}/T${techniqueId}/${date}/${time}`;
    return itemString;
  }

  // 日付のみ,ユーザーのみ選択された場合に対応するため．
  const isMatch = (objectName: string, regex: RegExp) => {
    if (!objectName || !regex.exec(objectName)) return false;
    const [userId, _techniqueId, timestamp] = objectName.split("-");
    // 選択されていなければ，今日の日付のビデオ
    const today = getFormattedDate();
    const dateMatch = selectedDate ? timestamp.includes(selectedDate.value) : timestamp.includes(today);
    const userMatch = selectedUser ? userId.includes(formatWithPadding(selectedUser.value)) : true;
    return dateMatch && userMatch;
  };

  // セレクトボックスのビデオリストの作成
  const onGetVideo = useCallback(() => {
    if (!objectList || !selectedUser || !isCorrectPass) {
      setOptions([]);
      return;
    }

    if (!objectList) return;
    const regex = /.+\.mp4/;

    const filteredOptions = objectList
      .filter(object => isMatch(object.Key?.toString() || "", regex))
      .map(object => ({
        value: object.Key || "",
        label: getItemListLabels(object.Key || "")
      }));

    setOptions(filteredOptions);
  }, [objectList, selectedDate, selectedUser, isCorrectPass]);

  useEffect(() => {
    if (!objectList || !isCorrectPass) {
      setOptions([]);
      return;
    }
  }, [isCorrectPass, objectList, selectedUser]);

  return { options, onGetVideo };
}
