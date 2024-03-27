import type { CollectionConfig } from "payload/types";

import { userRoles } from "@cms/constants/userRoles";
import { checkUserRole, hasRole, hasRoleOrSelf } from "@cms/utilities/accessControl";

const Users: CollectionConfig = {
    slug: "users",
    access: {
        // Only admins can create users
        create: hasRole("admin", userRoles),
        // Admins can read all, but any other logged-in user can only read themselves
        read: hasRoleOrSelf("admin", userRoles),
        // Admins can update all, but any other logged-in user can only update themselves
        update: hasRoleOrSelf("admin", userRoles),
        // Only admins can delete
        delete: hasRole("admin", userRoles),
    },
    admin: {
        useAsTitle: "email",
        group: "System",
    },
    auth: true,
    fields: [
        {
            name: "role",
            type: "select",
            defaultValue: "editor",
            admin: {
                isClearable: false,
            },
            options: [
                ...userRoles.map(role => {
                    return {
                        label: role,
                        value: role,
                    };
                }),
            ],
            access: {
                create: ({ req: { user } }) => checkUserRole(user, "admin", userRoles),
                read: ({ req: { user } }) => checkUserRole(user, "admin", userRoles),
                update: ({ req: { user } }) => checkUserRole(user, "admin", userRoles),
            },
        },
    ],
};

export default Users;
