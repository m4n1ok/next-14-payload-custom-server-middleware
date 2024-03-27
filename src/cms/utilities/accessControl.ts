import type { User } from "payload/auth";
import type { Access } from "payload/types";

export const checkUserRole = (user: User | null, role: string, allRoles: string[]) => {
    if (!user) {
        return false;
    }

    const userRole = user?.role;
    if (userRole === role) return true;

    return allRoles.indexOf(<string>userRole) >= allRoles.indexOf(role);
};

export const hasRole = <T = any, U = any>(role: string, allRoles: string[]): Access<T, U> => {
    return ({ req: { user } }) => {
        return checkUserRole(user, role, allRoles);
    };
};

export const hasRoleOrPublished = <T = any, U = any>(role: string, allRoles: string[]): Access<T, U> => {
    return ({ req }) => {
        // If there is a user logged in,
        // and their role is higher or equal to the passed role
        // let them retrieve all documents
        if (req.user) return checkUserRole(req.user, role, allRoles);

        // If there is no user,
        // restrict the documents that are returned
        // to only those where `_status` is equal to `published`
        // or where `_status` does not exist
        return {
            or: [
                {
                    _status: {
                        equals: "published",
                    },
                },
                {
                    _status: {
                        exists: false,
                    },
                },
            ],
        };
    };
};

export const hasRoleOrSelf = <T = any, U = any>(role: string, allRoles: string[]): Access<T, U> => {
    return ({ req: { user } }) => {
        if (checkUserRole(user, role, allRoles)) {
            return true;
        }

        return {
            id: {
                equals: user?.id,
            },
        };
    };
};
