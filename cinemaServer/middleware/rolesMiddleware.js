const autherizeRoles = (...allowedRoles) => {
  //return (req,res,next)=>{
  // if(!allowedRoles.includes(req.user.roles))
  //    return res.status(403).send({message:"Access denied"});
};

const rolesMiddleware = () => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user data found" });
    }

    // ✅ Check if user has the required role
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Access Denied: Insufficient permissions" });
    }

    return next();
  };
};

module.exports = { rolesMiddleware };
