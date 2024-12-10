import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export const LinkButton = ({ text, path }: { text: string, path: string }) => {
  const navigate = useNavigate();
  return (
    <Button variant="default" onClick={() => navigate(path)}>{text}</Button>
  )
}