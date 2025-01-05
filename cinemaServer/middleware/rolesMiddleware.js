const autherizeRoles = (...allowedRoles) => {
  //return (req,res,next)=>{
  // if(!allowedRoles.includes(req.user.roles))
  //    return res.status(403).send({message:"Access denied"});
};

const OnlyAdminRole = (userRole) => {
  return (req, res, next) => {
    if (!userRole) return res.status(403).send({ message: "Access denied" });
    return next();
  };
};

module.exports = { OnlyAdminRole };
