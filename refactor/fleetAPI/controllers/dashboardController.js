exports.getDashboard = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Bem-vindo ao dashboard, ${req.user.name}!`,
      user: req.user, // Retorna os dados do token decodificado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao acessar o dashboard.',
      details: error.message, // Opcional em produção
    });
  }
};
