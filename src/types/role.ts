export type RoleLevel = 1 | 2 | 3;

export type Role = {
  id: number;
  name: string;
  description: string;
  level: RoleLevel;
};
