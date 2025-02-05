import { useState } from "react";
import { AppShell, ComboboxItem } from "@mantine/core";
import { ControlPanel } from "./ControlPanel";
import { ItemsPanel } from "./ItemsPanel";

export const Feedback = () => {
  const [selectedDate, setDateValue] = useState<ComboboxItem|null>(null);
  const [selectedUser, setUserValue] = useState<ComboboxItem|null>(null);

  return(
    <>
      <AppShell.Navbar>
        <ControlPanel
          selectedDate={selectedDate}
          setDateValue={setDateValue}
          selectedUser={selectedUser}
          setUserValue={setUserValue}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <ItemsPanel/>
      </AppShell.Main>
    </>
  );
}