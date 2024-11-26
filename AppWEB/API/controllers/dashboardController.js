exports.getDashboard = (req, res) => {
  try {
    // Verifica se `req.user` existe (caso o middleware falhe ou não seja usado corretamente)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado. O token é inválido ou está ausente.',
      });
    }

    // Pega os dados do usuário autenticado
    const user = req.user;

    // Retorna sucesso
    res.status(200).json({
      success: true,
      message: `Bem-vindo ao dashboard, ${user.name}!`,
      user, // Retorna os dados do usuário
    });
  } catch (error) {
    // Captura e retorna qualquer erro inesperado
    res.status(500).json({
      success: false,
      message: 'Erro ao acessar o dashboard.',
      details: error.message,
    });
  }
};

