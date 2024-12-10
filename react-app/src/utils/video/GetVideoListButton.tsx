import { Button, ComboboxItem } from "@mantine/core"
import { ActivateState } from "../../consts/types";
import { useMemo } from "react";

interface Props {
  className?: string;
  selectedUser: ComboboxItem | null;
  isCorrectPassword: boolean;
  onGetVideo: () => void;
}

interface ButtonConfig {
  variant: "filled" | "outline";
  color: "blue" | "gray";
  text: string;
  disabled: boolean;
}

const buttonConfigs: Record<ActivateState, ButtonConfig> = {
  'activate': {
    variant: 'filled',
    color: 'blue',
    text: '動画を取得',
    disabled: false,
  },
  'no user selected': {
    variant: 'outline',
    color: 'gray',
    text: 'ユーザーを選択してください',
    disabled: true,
  },
  'wrong password': {
    variant: 'outline',
    color: 'gray',
    text: 'パスワードを正しく入力してください',
    disabled: true,
  },
};

export const GetVideoListButton: React.FC<Props> = ({className, selectedUser, isCorrectPassword, onGetVideo}) => {

  const activateState = useMemo<ActivateState>(() => {
    if (selectedUser && isCorrectPassword) return 'activate';
    if (!selectedUser) return 'no user selected';
    return 'wrong password';
  }, [selectedUser, isCorrectPassword]);

  const config = buttonConfigs[activateState];

  return (
    <Button
      className={className}
      onClick={onGetVideo}
      variant={config.variant}
      color={config.color}
      disabled={config.disabled}
    >
      {config.text}
    </Button>
  ) 
}
