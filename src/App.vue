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

async function cadastrar(evento: Event) {
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

async function remover(codigo: number) {
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
  <h1>Lista de tarefas</h1>
  <form @submit="cadastrar">
    <input type="text" placeholder="Tarefa" v-model="tarefa" required />
  </form>

  <h2 :class="{ linha: naoConcluido.length == 0 }">Para fazer</h2>
  <section>
    <div :key="item.codigo" v-for="(item, index) in naoConcluido">
      <span>{{ item.nome }}</span>

      <input type="checkbox" v-model="item.feito" @change="atualizarStatus(item)" />
      <button @click="remover(item.codigo)">x</button>
    </div>
  </section>

  <h2>Concluído</h2>
  <section>
    <div :key="item.codigo" v-for="(item, index) in concluido">
      <span class="tarefaFeita">{{ item.nome }}</span>

      <input type="checkbox" v-model="item.feito" @change="atualizarStatus(item)" />
      <button @click="remover(item.codigo)">x</button>
    </div>
  </section>
</template>

<style scoped>
h1 {
  display: block;
}

.linha {
  text-decoration: line-through;
}

.tarefaFeita {
  text-decoration: line-through;
  color: red;
}

button {
  margin-left: 10px;
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
