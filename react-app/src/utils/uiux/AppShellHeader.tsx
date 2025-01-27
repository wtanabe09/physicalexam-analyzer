import { AppShell, Burger, Button, Drawer, Group, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { AuthUser } from "aws-amplify/auth";
import { Link } from "react-router-dom"

type Props = {
  user: AuthUser | undefined,
  signOut: ((data?: any) => void) | undefined,
}

export const AppShellHeader = ({ user, signOut }: Props) => {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Title order={3}>身体診察学習システム</Title>
        <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size="sm" />
        <Drawer opened={opened} onClose={close} title={user?.username} position='right'>
          <Group w="100%">
            <Button variant="default" onClick={signOut}>ログアウト</Button>
            <Button variant="default" component={Link} to={"/recording"}>録画画面へ</Button>
            <Button variant="default" component={Link} to={"/videos"}>動画選択画面へ</Button>
          </Group>
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