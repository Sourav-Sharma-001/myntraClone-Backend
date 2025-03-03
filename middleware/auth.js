

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['Authorization'];
    if(!auth) {
        return res.status(403).json({ message: 'unauthorized, jwt token required' });
        } try {
            const decoded = jwt.verify(auth, process.env.SECRET_KEY);
            req.user = decoded;
            next();
        } catch (err)  {
            return res.status(403).json({ message: 'unauthorized, jwt token is wrong or expired'});
        }     
}

module.exports = ensureAuthenticated;