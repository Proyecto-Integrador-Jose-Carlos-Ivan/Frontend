<template>
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2023 Sistema de Teleoperadores. Todos los derechos reservados.</p>
        <nav>
          <a href="/privacidad">Política de Privacidad</a>
          <a href="/terminos">Términos de Uso</a>
          <a href="/contacto">Contacto</a>
        </nav>
      </div>
    </footer>
  </template>
  
  <style scoped>
  .app-footer {
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 1.5rem 0;
    margin-top: 2rem;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
  }
  
  p {
    margin: 0;
  }
  
  nav {
    display: flex;
    gap: 1.5rem;
  }
  
  a {
    color: #ecf0f1;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  a:hover {
    color: #3498db;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
  
    nav {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  </style>
  