const db = require("../config/db");
const bcrypt = require("bcrypt");
const registrarUsuario = async (req,res)=>{
  const {username,password} = req.body;
  try{
    const [users] = await db.execute(
      "SELECT * FROM users WHERE username = ?",[username]
    );
    if(users.length > 0){
      return res.status(409).json({
        error: "Conflict",
        mensaje:"El usuario ya se encuentra registrado en la base de datos"
      });
    }
    const passwordHash = await bcrypt.hash(password,10);
    await db.execute(
      "INSERT INTO users (username,password) VALUES (?,?)",[username,passwordHash]
    );
    res.status(200).json({
      mensaje:"Usuario registrado correctamente",
    });
  }catch(e){
    console.error(e);
    res.status(500).json({
      error:"Error interno del servidor"
    });
  }
};
const login = async (req,res)=>{
  const {username,password} = req.body;
   try{
    const [users] = await db.execute(
      "SELECT * FROM users WHERE username = ?",[username]
    );
    const userFound = users[0];
    if(userFound == null) res.status(404).json({
      error:"Not found",
      mensaje:"El usuario no se encuentra en la base de datos"
    });
    const passwordValid = await bcrypt.compare(password,userFound.password)
    if(!passwordValid) res.status(401).json({
      error:"Unauthorized",
      mensaje:"Autenticación invalida"
    });
    
    res.status(200).json({
      mensaje:"Autenticación correcta"
    })

  }catch(e){
      console.log(e);
      res.status(500).json({
        mensaje:"Error en el servidor"
      })
  }
};
module.exports = {registrarUsuario, login};