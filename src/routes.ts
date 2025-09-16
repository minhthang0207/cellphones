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
export const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify"
];

/**
 * The default redirect path after logging in (user)
 * @type {string}
 */
export const DEFAULT_LOGIN_USER_REDIRECT = "/"


/**
 * The default redirect path after logging in (admin)
 * @type {string}
 */
export const DEFAULT_LOGIN_ADMIN_REDIRECT = "/dashboard-admin"