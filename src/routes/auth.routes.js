const express = require("express");
const router = express.Router();

const db = require("../config/db");

router.post("/registro", async (req,res)=>{
  const {username,password} = req.body;
  
  if(!username || !password){
    return res.status(400).json({
      error: "Usuario y contraseña, son obligatorios"
    });
  }
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
    await db.execute(
      "INSERT INTO users (username,password) VALUES (?,?)",[username,password]
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
});
router.post("/login", async (req,res)=>{
  const {username,password} = req.body;
  if(!username || !password){
    return res.status(400).json({
      error: "Usuario y contraseña, son obligatorios"
    });
  }
   try{
    const [users] = await db.execute(
      "SELECT * FROM users WHERE username = ?",[username]
    );
    const userFound = users[0];
    if(userFound == null) res.status(404).json({
      error:"Not found",
      mensaje:"El usuario no se encuentra en la base de datos"
    });
    if(password !== userFound.password) res.status(409).json({
      error:"Conflict",
      mensaje:"El usuario o contraseña no coinciden"
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
})
module.exports = router;