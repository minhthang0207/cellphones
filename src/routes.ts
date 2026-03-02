/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
// login and logout user
// export const publicRoutes = [
//     "/",
//     "dien-thoai",
//     "may-tinh-bang",
//     "lap-top"
// ];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /
 * @type {string[]}
 */
// only for logout user
export const AUTH_ROUTES = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify"
];

/**
 * The default redirect path after logging in (user)
 * @type {array}
 */
export const USER_PROTECTED = ["/lich-su-mua-hang"]


/**
 * The default redirect path after logging in (admin)
 * @type {array}
 */
export const ADMIN_PROTECTED = ["/dashboard-admin"];