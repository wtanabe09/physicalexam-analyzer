import { fetchUserAttributes } from "aws-amplify/auth"
import { useEffect, useState } from "react"
import { ComboboxData } from "@mantine/core";

// options, set function
export const useListUsers = ():ComboboxData => {
  const [listUsers, setListUsers] = useState<ComboboxData>();

  const getCurrentUserAsync = async () => {
    const currentUser = await fetchUserAttributes();
    if (!currentUser) return;
    // if current user is admin then get list-users
    const array = [{value: currentUser.sub!, label: currentUser.name!}]
    setListUsers(array);
  }

  useEffect(() => {
    getCurrentUserAsync();
  }, [])

  return listUsers!
}