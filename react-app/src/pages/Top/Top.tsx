import { AuthUser } from "aws-amplify/auth";

interface Prop {
  user: AuthUser | undefined;
  signOut: ((data?: any) => void) | undefined;
}

export const Top = ({user, signOut}: Prop) => {
  return (
    <div className="h-screen pt-20">
      <h1>Hello</h1>
      <button onClick={signOut}>Sign out</button>
    </div>
  )
}