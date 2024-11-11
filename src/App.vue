<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore'

// Configuração do Firebase
const firebaseConfig = {
  // Insira aqui suas credenciais do Firebase
  apiKey: "AIzaSyCVLDzvzlC8WvwaLQHH7EhB49Q0oz8htFg",
  authDomain: "vue-to-do-86986.firebaseapp.com",
  projectId: "vue-to-do-86986",
  storageBucket: "vue-to-do-86986.firebasestorage.app",
  messagingSenderId: "200873703587",
  appId: "1:200873703587:web:66523813024d736a116716"
}

// Inicializa o Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

//criando um novo tipo para representar a Tarefa
type Tarefa = {
  codigo: number
  nome: string
  feito: boolean
  id?: string // ID do documento no Firestore
}

let incremento = 0
const tarefa = ref('')
const lista = ref<Tarefa[]>([])

// Carregar tarefas do Firestore ao iniciar
onMounted(async () => {
  // Observa mudanças em tempo real
  onSnapshot(collection(db, 'tarefas'), (snapshot) => {
    lista.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Tarefa[]

    // Atualiza o incremento para o maior código + 1
    incremento = Math.max(...lista.value.map(t => t.codigo), -1) + 1
  })
})

const concluido = computed(() => {
  return lista.value.filter(i => i.feito)
})

const naoConcluido = computed(() => {
  return lista.value.filter(i => !i.feito)
})

async function cadastrarTarefa(evento: Event) {
  evento.preventDefault()

  // Verifica se o campo tarefa está vazio
  if (!tarefa.value.trim()) {
    return
  }

  const novaTarefa = {
    codigo: incremento,
    nome: tarefa.value,
    feito: false,
  }

  try {
    // Adiciona ao Firestore
    await addDoc(collection(db, 'tarefas'), novaTarefa)
    incremento++
    tarefa.value = ''
  } catch (erro) {
    console.error('Erro ao cadastrar tarefa:', erro)
  }
}

async function removerTarefa(codigo: number) {
  try {
    const tarefaParaRemover = lista.value.find(t => t.codigo === codigo)
    if (tarefaParaRemover?.id) {
      await deleteDoc(doc(db, 'tarefas', tarefaParaRemover.id))
    }
  } catch (erro) {
    console.error('Erro ao remover tarefa:', erro)
  }
}

async function atualizarStatus(item: Tarefa) {
  try {
    if (item.id) {
      await updateDoc(doc(db, 'tarefas', item.id), {
        feito: item.feito
      })
    }
  } catch (erro) {
    console.error('Erro ao atualizar status:', erro)
  }
}
</script>

<template>
  <h1>Lista de Tarefas</h1>
  <form @submit="cadastrarTarefa">
    <input type="text" placeholder="Digite uma tarefa..." v-model="tarefa" />
  </form>
  <h2 :class="{ linha: naoConcluido.length == 0 }">Para Fazer</h2>
  <section>
    <div :key="item.codigo" v-for="item in naoConcluido">
      {{ item.nome }}
      <input type="checkbox" v-model="item.feito" />
      <button @click="removerTarefa(item.codigo)">X</button>
    </div>
  </section>
  <h2>Concluido</h2>
  <div :key="item.codigo" v-for="item in concluido">
    <span class="tarefaFeita">{{ item.nome }}</span>
    <button @click="removerTarefa(item.codigo)">X</button>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2em;
  text-align: center;
  margin-bottom: 20px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.linha {
  text-decoration: line-through;
}

.tarefaFeita {
  text-decoration: line-through;
  color: red;
}

button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  cursor: pointer;
  background-color: red;
}

input {
  background: transparent;
  border: 1px solid #999fc6;
  border-radius: 15px;
  padding: 10px;
  outline: none;
  color: #e1e8ef;
}

input:focus {
  border: 1px solid #e1e8ef;
}</style>
