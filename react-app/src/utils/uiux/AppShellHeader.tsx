import { AppShell, Burger, Button, Drawer, Group, Stack, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { fetchUserAttr } from "../aws/cognitoUtil";

type Props = {
  signOut: ((data?: any) => void) | undefined,
}

export const AppShellHeader = ({ signOut }: Props) => {
  const [opened, { toggle, close }] = useDisclosure();
  const [userName, setUserAttr] = useState<string|null>(null);
  useEffect(() => {
    fetchUserAttr().then(res => setUserAttr(res.name!));
  }, [])

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Title order={3}>身体診察学習システム</Title>
        
        <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size="sm" />
        <Drawer opened={opened} onClose={close} title={`ユーザー：${userName}`} position='right'>
          <Stack>
            <Button variant="default" component={Link} to={"/recording"} onClick={close}>録画画面へ</Button>
            <Button variant="default" component={Link} to={"/videos"} onClick={close}>動画選択画面へ</Button>
            <Button variant="default" onClick={signOut}>ログアウト</Button>
          </Stack>
        </Drawer>
        
        <Group visibleFrom='sm'>
          <Button variant="default" component={Link} to={"/recording"}>録画画面へ</Button>
          <Button variant="default" component={Link} to={"/videos"}>動画選択画面へ</Button>
          <Button variant="default" onClick={signOut}>ログアウト</Button>
        </Group>

      </Group>
    </AppShell.Header>
  )
}