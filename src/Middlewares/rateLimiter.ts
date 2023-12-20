export const configRateLimit = {
    windowMs: 60 * 1000, // 1 minutes
    max: 10000, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: true,
}