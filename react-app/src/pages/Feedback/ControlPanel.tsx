import { ComboboxData, Select } from "@mantine/core"
import { dateOptions } from "../../exports/consts";
import { GetVideoListButton } from "../../utils/video/GetVideoListButton";
import { useListUsers } from "../../utils/user/useListUsers";

interface Props {
  selectedDate: any;
  setDateValue: (option: any) => void;
  selectedUser: any;
  setUserValue: (option: any) => void;
  onGetObjectKeys: () => void;
  videoObjectKeys: ComboboxData;
  selectedVideo: any;
  setVideoKey: (option: any) => void;
}

export const ControlPanel: React.FC<Props> = ({
  selectedDate, setDateValue,
  selectedUser, setUserValue,
  onGetObjectKeys,
  videoObjectKeys, selectedVideo, setVideoKey,
}) => {
  const listUsers = useListUsers();
  const getVideoPlaceholder = (videoObjectKeys: ComboboxData) => {
    return videoObjectKeys && videoObjectKeys.length > 0 ? "ビデオを選択" : "ビデオは選択できません";
  };

  return (
    <div className="bg-white p-2">
      <h2 className="text-lg font-semibold mb-2">動画選択</h2>
      <div className="flex flex-wrap gap-4">
        <Select
          className="w-full"
          data={dateOptions}
          value={selectedDate ? selectedDate.value : null}
          onChange={(_value, option) => setDateValue(option)}
          placeholder={new Date().toLocaleDateString()}
        />
        <Select
          className="w-full"
          data={listUsers}
          value={selectedUser ? selectedUser.value : null}
          onChange={(_value, option) => setUserValue(option)}
          placeholder="ユーザーを選択してください"
        />
        <GetVideoListButton
          className="w-full"
          selectedUser={selectedUser}
          onGetVideo={onGetObjectKeys}
        />
        <Select
          className="w-full"
          data={videoObjectKeys}
          value={selectedVideo ? selectedVideo.value : null}
          onChange={(_value, option) => setVideoKey(option)}
          placeholder={getVideoPlaceholder(videoObjectKeys)}
        />
      </div>
    </div>
  )
}