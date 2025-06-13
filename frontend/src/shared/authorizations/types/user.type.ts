export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  profileImage?: string | null;
  roleId: string;
  role: {
    id: string;
    roleName: string;
    permissions: PermissionCheck;
  };
};

export type PermissionCheck = {
  resource: string;
  action: string;
};
