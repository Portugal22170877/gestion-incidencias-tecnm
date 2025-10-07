const bcrypt = require('bcrypt');

async function hashPasswords() {
  const saltRounds = 10;
  
  // Hash para la contraseña "password" (usuarios existentes)
  const passwordHash = await bcrypt.hash('password', saltRounds);
  console.log('Hash para "password":', passwordHash);
  
  // Hash para la contraseña "admin123" (administrador)
  const adminHash = await bcrypt.hash('admin123', saltRounds);
  console.log('Hash para "admin123":', adminHash);
  
  // Hash para la contraseña "Temp123!" (nuevos usuarios)
  const tempHash = await bcrypt.hash('Temp123!', saltRounds);
  console.log('Hash para "Temp123!":', tempHash);
}

hashPasswords().catch(console.error);