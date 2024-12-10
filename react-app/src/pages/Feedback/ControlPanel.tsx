import { PasswordInput, Select } from "@mantine/core"
import { dateOptions, userOptions } from "../../consts/consts";
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
  onGetVideo: () => void;
  videoOptions: any[];
  selectedVideo: any;
  setVideoValue: (option: any) => void;
  placeholder: string;
}

export const ControlPanel: React.FC<Props> = ({
  selectedDate, setDateValue,
  selectedUser, setUserValue,
  password, setPassword,
  isCorrectPassword, onGetVideo,
  videoOptions, selectedVideo, setVideoValue,
  placeholder
}) => {

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
          onGetVideo={onGetVideo}
        />
        <Select
          className="w-full"
          data={videoOptions}
          value={selectedVideo ? selectedVideo.value : null}
          onChange={(_value, option) => setVideoValue(option)}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}