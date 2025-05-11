const { getLoggedUserDetails } = require("../services/userDBServ");

const autherizeRoles = (...allowedRoles) => {
  //return (req,res,next)=>{
  // if(!allowedRoles.includes(req.user.roles))
  //    return res.status(403).send({message:"Access denied"});
};

const adminMiddleware = () => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No user data found" });
      }

      //  Check if user has the required role
      if (!req.user.isAdmin) {
        return res
          .status(403)
          .header("Access-Control-Expose-Headers", "X-Unauth-Reason")
          .header("X-Unauth-Reason", "No-Admin-Permission")
          .send({ message: "Access Denied: No Admin permissions" });
      }
      return next();
    } catch (error) {
      return res
        .status(403)
        .send({ message: `Error inadminMiddleware ${error.r.message}` });
    }
  };
};

module.exports = { adminMiddleware };
