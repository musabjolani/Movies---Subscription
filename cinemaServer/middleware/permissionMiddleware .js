const autherizeRoles = (...allowedRoles) => {
  //return (req,res,next)=>{
  // if(!allowedRoles.includes(req.user.roles))
  //    return res.status(403).send({message:"Access denied"});
};

const permissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .header("X-Unauth-Reason", "invalid-token")
        .send({ message: "Unauthorized" });

    const { data: user } = await axios.get(url, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!user.permissions || !user.permissions.includes(requiredPermission)) {
      return res
        .status(403)
        .header("X-Unauth-Reason", "insufficient-permissions")
        .json({ message: "Access Denied: Insufficient permissions" });
    }
    return next();
  };
};

module.exports = { permissionMiddleware };
