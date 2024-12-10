import { Checkbox } from "@mantine/core";
import { useCallback } from "react";

interface ToggleButtonProps {
  status: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  labelText: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ status, setState, labelText }) => {
  const handleChange = useCallback(() => {
    setState(prev => !prev);
  }, [setState]);

  return (
    <Checkbox
      label={labelText}
      checked={status}
      onChange={handleChange}
      color="cyan"
    />
  );
};