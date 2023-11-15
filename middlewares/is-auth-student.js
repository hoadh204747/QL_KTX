module.exports = (req, res, next) => {
    if (req.session.user.role === "member") {
        next();
    }
}