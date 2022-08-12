const slug = (name) => {
    if(name) {
    return name.toLowerCase().trim().replace(/\s+/g, '.')
}
}

const permissions = [
    {
        name: "master admin",
        slug: slug("master admin")
    },
    {
        name: "users view",
        slug: slug("users view")
    },
    {
        name: "users create",
        slug: slug("users create")
    },
    {
        name: "users edit",
        slug: slug("users edit")
    },
    {
        name: "users delete",
        slug: slug("users delete")
    },
    {
        name: "roles",
        slug: slug("roles")
    },
    {
        name: "permissions",
        slug: slug("permissions")
    },
];

const roles = [
    {
        name: "Admin",
        slug: slug("admin")
    },
    {
        name: "Editor",
        slug: slug("editor")
    },
    {
        name: "User",
        slug: slug("user")
    },
];

module.exports = {
    permissions, roles
}