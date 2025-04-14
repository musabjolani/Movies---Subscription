const { getLoggedUserDetails } = require("../services/userDBServ");

const autherizeRoles = (...allowedRoles) => {
  //return (req,res,next)=>{
  // if(!allowedRoles.includes(req.user.roles))
  //    return res.status(403).send({message:"Access denied"});
};

const adminMiddleware = () => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.Authorization || req.headers.authorization;
      if (!authHeader)
        return res
          .status(401)
          .header("x-unauth-reason", "invalid-token")
          .send({ message: "Unauthorized" });

      const user = await getLoggedUserDetails(authHeader);

      //  Check if user has the required role
      if (!user.isAdmin) {
        return res
          .status(403)
          .header("x-unauth-reason", "No-Admin-Permission")
          .send({ message: "Access Denied: No Admin permissions" });
      }
      return next();
    } catch (error) {
      return res
        .status(403)
        .header("x-unauth-reason", "Admin-Error")
        .send({ message: error.r.message });
    }
  };
};

module.exports = { adminMiddleware };
