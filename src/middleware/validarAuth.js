const validarAuth = (req,res,next)=>{
  
  const {username,password} = req.body;
  
  if(typeof username != "string" || typeof password != "string" || !username.trim() || !password ){
    return res.status(400).json({
      error:"Bad request",
      mensaje:"Usuario o contraseña invalidos"
    });
  }
  
  next();
}
module.exports = validarAuth;