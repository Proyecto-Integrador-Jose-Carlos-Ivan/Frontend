const server = import.meta.env.VITE_URL_API
const origin = import.meta.env.VITE_ORIGIN_URL

export default class AuthRepository {
  async login(email, password) {
    const body = JSON.stringify({ email: email, password: password })
    const response = await fetch(server + 'api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    })

    return await response.json()
  }

  async loginWithCredentials(payload) {
    const response = await this.login(payload.email, payload.password);
    return response;
  }

  async loginWithGoogle() {
    const width = 500
    const height = 600
    const left = screen.width / 2 - width / 2
    const top = screen.height / 2 - height / 2

     window.open(
      server + 'api/login/google',
      'Iniciar sesión con Google',
      `width=${width},height=${height},top=${top},left=${left}`
    )

    return new Promise((resolve) => {
      // const checkPopup = setInterval(() => {
      //   if (!authWindow || authWindow.closed) {
      //     clearInterval(checkPopup)
      //     reject(new Error('Popup cerrado'))
      //   }
      // }, 500)
  
      window.addEventListener('message', (event) => {
        console.log(event.origin + ' ' + origin)
        if (event.origin !== origin) return
        console.log('message')
        console.log(event.data.success)
        // if(event.data.success){
          resolve(event.data)
        // }else{
        //   reject(new Error(event.data.error ?? 'Error al iniciar sesión con Google'))
        // }

       
      })
    })
  }
}