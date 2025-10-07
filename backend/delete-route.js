// Endpoint para eliminar departamento
app.delete('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { pool } = require('./src/config/database');
    const connection = await pool.getConnection();

    // Verificar si el departamento tiene usuarios asociados
    const [userCheck] = await connection.execute(
      'SELECT COUNT(*) as count FROM users WHERE department_id = ?',
      [id]
    );

    if (userCheck[0].count > 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el departamento porque tiene usuarios asociados'
      });
    }

    // Eliminar el departamento
    const [result] = await connection.execute(
      'DELETE FROM departments WHERE id = ?',
      [id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Departamento no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Departamento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando departamento:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando departamento'
    });
  }
});