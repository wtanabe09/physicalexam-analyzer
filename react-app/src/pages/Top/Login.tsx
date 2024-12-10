import { Container, Title, Text, Anchor, Paper, TextInput, Button, PasswordInput } from "@mantine/core";

export const LoginPage = () => {
  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        ようこそ
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        アカウントをお持ちでない場合は{' '}
        <Anchor size="sm" component="button">
          新規登録
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="メールアドレス" placeholder="you@example.com" required />
        <PasswordInput label="パスワード" placeholder="Your password" required mt="md" />
        <Button fullWidth mt="xl" color="primary">
          ログイン
        </Button>
      </Paper>
    </Container>
  );
};