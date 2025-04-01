import { avatarTheme } from "../styles/theme";

type AvatarThemeKeys = keyof typeof avatarTheme;

export type UserTable = {
  id: number;
  createdAt: string;
  firstName: string;
  lastName: string;
  avatarColor:  AvatarThemeKeys
}
