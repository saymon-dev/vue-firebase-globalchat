<template>
  <div id="app">
    <!-- Logo en la esquina superior izquierda -->
    <img src="https://www.hyl.cl/assets/img/isologo_verde.png" class="logo" alt="logo" />
    
    <!-- Imagen de fondo -->
    <img src="https://www.hyl.cl/assets/img/inicio_bg.jpg" class="background-img" alt="background" />

    <h1>Vue Chat + Firebase</h1>

    <!-- Bienvenida al usuario autenticado -->
    <div v-if="user" id="welcomeMessage" class="user-info">
      <img :src="user.photoURL" alt="User Avatar" class="user-avatar" />
      <p>Bienvenido, {{ user.displayName }}</p>
      <button @click="logout" class="logout-button">Cerrar sesión</button>
    </div>

    <button v-if="!user" @click="loginWithGoogle" class="login-button">Login con Google</button>

    <div v-if="user">
      <Chat v-if="user" :currentUser="user" /> <!-- Pasamos el usuario al componente de chat -->
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth } from './firebase'; 
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import Chat from './components/Chat.vue'; // Importar el componente de chat

export default {
  name: 'App',
  components: {
    Chat
  },
  setup() {
    const user = ref(null);

    // Verificar si hay un usuario autenticado
    onMounted(() => {
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
      });
    });

    // Función para iniciar sesión con Google
    const loginWithGoogle = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        user.value = result.user;
      } catch (error) {
        console.error('Error during login', error);
      }
    };

    // Función para cerrar sesión y redirigir al inicio
    const logout = async () => {
      try {
        await signOut(auth);
        user.value = null;
      } catch (error) {
        console.error('Error during logout', error);
      }
    };

    return {
      loginWithGoogle,
      logout,
      user
    };
  }
};
</script>

<style scoped>
/* Estilos para el fondo */
.background-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(3px);
  z-index: -1;
}

/* Estilo para el contenedor principal */
#app {
  text-align: left;
  position: relative;
  z-index: 1;
  font-family: "Helvetica Neue", 'Times New Roman', Times, serif, sans-serif;
  color: black;
}

/* Logo en la esquina superior izquierda */
.logo {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 140px;
}

/* Estilo para la información del usuario y el botón de cerrar sesión */
.user-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

/* Estilo para el texto de bienvenida */
.user-info p {
  margin-right: 20px;
  font-size: 1.2rem;
}

/* Botón de login */
.login-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 20px;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

/* Botón de cerrar sesión */
.logout-button {
  padding: 10px 20px;
  background-color: #ffc107; /* Amarillo */
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

/* Estilo para welcomeMessage */
#welcomeMessage {
  position: fixed;
  top: 10px;
  right: 20px;
  padding: 10px 10px;
  border-radius: 5px;
  font-size: 14px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 10px; /* Espacio entre imagen y texto */
  z-index: 1000;
}

/* Estilo para la imagen de perfil del usuario */
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
}

</style>

