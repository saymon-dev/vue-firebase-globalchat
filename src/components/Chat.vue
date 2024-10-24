<template>
  <div class="chat-container">
    <h2 class="titulo_chat">🟢 Chat Global ✉️</h2>
    <div class="message-container" v-for="message in messages" :key="message.id">
      <img :src="message.photoURL" alt="User Avatar" class="user-avatar">
      <div class="message-content">
        <p class="message-author">{{ message.displayName }}</p>
        <p class="message-text">{{ message.text }}</p>
      </div>
      <!-- Botón para eliminar mensaje (solo si el usuario es administrador) -->
      <button v-if="isAdmin" @click="deleteMessage(message.id)" class="delete-button">Eliminar</button>
    </div>

    <!-- Contenedor de input y botón en la misma fila -->
    <div class="message-input-container">
      <input 
        v-model="newMessage" 
        placeholder="Escribe un mensaje..." 
        class="message-input" 
        @keyup.enter="sendMessage"  
      />
      <button @click="sendMessage" class="send-button">
        <!-- Icono de enviar (usando Tailwind y Material Icons) -->
        <span class="material-icons">send</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { auth } from '../firebase'; 

export default {
  name: 'GlobalChat',
  props: {
    currentUser: Object // Recibimos el usuario actual desde App.vue
  },
  setup(props) {
    const newMessage = ref('');
    const messages = ref([]);
    const user = ref(auth.currentUser); 

    // Verificación si es administrador
    const isAdmin = props.currentUser && props.currentUser.email === "simon.andaurt@gmail.com";

    // Obtener mensajes en tiempo real desde Firestore
    onMounted(() => {
      const messagesCollection = collection(db, 'messages'); 
      const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc')); 

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        messages.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      });

      return () => unsubscribe();
    });

    // Enviar mensaje a Firestore
    const sendMessage = async () => {
      if (newMessage.value.trim() && user.value) {
        try {
          await addDoc(collection(db, 'messages'), {
            text: newMessage.value,
            displayName: user.value.displayName, 
            photoURL: user.value.photoURL, 
            timestamp: new Date()
          });
          newMessage.value = ''; 
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    };

    // Eliminar mensaje (solo si es administrador)
    const deleteMessage = async (messageId) => {
      try {
        await deleteDoc(doc(db, 'messages', messageId));
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    };

    return {
      newMessage,
      messages,
      sendMessage,
      deleteMessage,
      isAdmin
    };
  }
};
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 50px;
}

.message-container {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.message-content {
  background-color: #e0f7fa;
  padding: 10px;
  border-radius: 8px;
  max-width: 75%;
  margin-right: 10px;
}

.message-author {
  font-weight: bold;
  margin-bottom: 5px;
}

.message-text {
  margin: 0;
}

.message-input-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.message-input {
  flex-grow: 1;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.send-button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.send-button .material-icons {
  font-size: 20px;
}

.delete-button {
  padding: 5px 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.titulo_chat{
  margin-bottom: 50px;
}

</style>
