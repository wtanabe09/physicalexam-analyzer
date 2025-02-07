import { Select, Stack } from "@mantine/core"
import { dateOptions } from "../../exports/consts";

interface Props {
  selectedDate: any;
  setDateValue: (option: any) => void;
  selectedUser: any;
  setUserValue: (option: any) => void;
}

export const ControlPanel: React.FC<Props> = ({
  selectedDate, setDateValue,
  selectedUser, setUserValue,
}) => {
  const listUsers = [{value: "", label: ""}];

  return (
    <Stack p="md" className="bg-white">
      <h2 className="text-lg font-semibold mb-2">動画選択</h2>
      <Select
        className="w-full"
        data={dateOptions}
        value={selectedDate ? selectedDate.value : null}
        onChange={(_value, option) => setDateValue(option)}
        placeholder={new Date().toLocaleDateString()}
      />
      <Select
        className="w-full"
        data={listUsers!}
        value={selectedUser ? selectedUser.value : null}
        onChange={(_value, option) => setUserValue(option)}
        placeholder="ユーザーを選択してください"
      />
    </Stack>
  )
}