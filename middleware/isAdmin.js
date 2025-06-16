const isAdmin=async(req,res,next)=>{
  try {
    if(req.user?.role==="admin") return next()
        return res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    console.log(error)
    next(new Error("only admin access route"))
  }
}

module.exports ={isAdmin};