import { ComboboxItem } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import { SelectBoxOption } from "../../consts/consts";


interface SelectVideoMethods {
  setVideoValue: Dispatch<SetStateAction<ComboboxItem | null>>;
}
export const useVideoSelectBox = (): [SelectBoxOption[], ComboboxItem | null, SelectVideoMethods] => {
  const [selectedOption, setVideoValue] = useState<ComboboxItem | null>(null);
  const videoOptions = [{ value: '', label: '' }];
  
  return [videoOptions, selectedOption, { setVideoValue }];
}