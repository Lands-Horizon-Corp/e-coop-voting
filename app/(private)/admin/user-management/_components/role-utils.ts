import { user } from "next-auth";
import { Role } from "@prisma/client";

type roleListType = {
    role: Role;
    allowedRoles: Role[];
    allowedEditor: Role[];
};

const roleList: roleListType[] = [
    {
        role: Role.coop_root,
        allowedRoles: [Role.root],
        allowedEditor: [Role.root],
    },
    {
        role: Role.admin,
        allowedRoles: [Role.root, Role.coop_root],
        allowedEditor: [Role.root, Role.coop_root],
    },
    {
        role: Role.staff,
        allowedRoles: [Role.root, Role.coop_root, Role.admin],
        allowedEditor: [Role.admin, Role.coop_root, Role.root],
    },
];

export const getAssignableRoles = (editor: user) => {
    return roleList.filter((roleEntry) =>
        roleEntry.allowedRoles.includes(editor.role),
    );
};

export const canEditRole = (yourRole: Role, roleToEdit: Role) => {
    const foundRole = roleList.find((roleEntry) => roleEntry.role === roleToEdit);
    if (!foundRole) return false;

    return foundRole.allowedEditor.includes(yourRole);
};
