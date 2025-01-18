import { PasswordInput, Select } from "@mantine/core"
import { dateOptions, SelectBoxOption, userOptions } from "../../consts/consts";
import { LinkButton } from "../../utils/uiux/LinkButton";
import { GetVideoListButton } from "../../utils/video/GetVideoListButton";

interface Props {
  selectedDate: any;
  setDateValue: (option: any) => void;
  selectedUser: any;
  setUserValue: (option: any) => void;
  password: string;
  setPassword: (value: string) => void;
  isCorrectPassword: boolean;
  onGetObjectKeys: () => void;
  videoOptions: any[];
  selectedVideo: any;
  setVideoKey: (option: any) => void;
}

export const ControlPanel: React.FC<Props> = ({
  selectedDate, setDateValue,
  selectedUser, setUserValue,
  password, setPassword,
  isCorrectPassword, onGetObjectKeys,
  videoOptions, selectedVideo, setVideoKey,
}) => {

  const getVideoPlaceholder = (videoOptions: SelectBoxOption[], isCorrect: boolean) => {
    return videoOptions.length > 0 && isCorrect
      ? "ビデオを選択"
      : "ビデオは選択できません";
  };

  return (
    <div className="bg-white p-2">
      <div className="link-field hidden md:block mb-4 pb-2 border-b">
        <LinkButton text="録画画面へ" path="/" />
      </div>
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
          data={userOptions}
          value={selectedUser ? selectedUser.value : null}
          onChange={(_value, option) => setUserValue(option)}
          placeholder="ユーザーを選択してください"
        />
        <PasswordInput
          className="w-full"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          placeholder="パスワードを入力してください"
        />
        <GetVideoListButton
          className="w-full"
          selectedUser={selectedUser}
          isCorrectPassword={isCorrectPassword}
          onGetVideo={onGetObjectKeys}
        />
        <Select
          className="w-full"
          data={videoOptions}
          value={selectedVideo ? selectedVideo.value : null}
          onChange={(_value, option) => setVideoKey(option)}
          placeholder={getVideoPlaceholder(videoOptions, isCorrectPassword)}
        />
      </div>
    </div>
  )
}