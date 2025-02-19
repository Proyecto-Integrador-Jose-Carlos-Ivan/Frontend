const server = import.meta.env.VITE_URL_API;
const origin = import.meta.env.VITE_ORIGIN_URL;

export default class AuthRepository {
  async login(email, password) {
    const body = JSON.stringify({ email, password });
    const response = await fetch(server + 'api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    });
    return await response.json();
  }

  async loginWithCredentials(payload) {
    const response = await this.login(payload.email, payload.password);
    return response;
  }

  async loginWithGoogle() {
    console.log('Opening Google login popup...');
    const width = 500;
    const height = 600;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;

    const popup = window.open(
      server + 'api/login/google',
      'Iniciar sesión con Google',
      `width=${width},height=${height},top=${top},left=${left}`
    );
    
    if (!popup) {
      console.error('Popup blocked');
      return;
    }

    console.log('Popup opened. Waiting for message...');

    return new Promise((resolve) => {
      const messageHandler = (event) => {
        console.log('Received message:', event);
        if (event.origin !== 'http://localhost') {
          console.warn(`Origin mismatch: expected ${origin}, got ${event.origin}`);
          return;
        }
        window.removeEventListener('message', messageHandler);
        resolve(event.data);
      };
      window.addEventListener('message', messageHandler);
    });
  }
}