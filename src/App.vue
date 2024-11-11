<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { db } from './firebaseConfig'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'

const tarefa = ref('')
const lista = ref<Tarefa[]>([])
let incremento = 0
type Tarefa = {
  codigo: number
  feito: boolean
  nome: string
}

async function carregarTarefas() {
  const querySnapshot = await getDocs(collection(db, 'tarefas'))
  querySnapshot.forEach((doc) => {
    const data = doc.data() as Tarefa
    lista.value.push({
      codigo: data.codigo,
      nome: data.nome,
      feito: data.feito,
    })
    incremento = Math.max(incremento, data.codigo + 1)
  })
}

async function cadastrarTarefa(evento: Event) {
  evento.preventDefault()
  try {
    const docRef = await addDoc(collection(db, 'tarefas'), {
      codigo: incremento,
      nome: tarefa.value,
      feito: false,
    })
    lista.value.push({
      codigo: incremento,
      nome: tarefa.value,
      feito: false,
    })
    incremento++
    tarefa.value = ''
    console.log("Documento escrito com ID: ", docRef.id)
  } catch (e) {
    console.error("Erro ao adicionar documento: ", e)
  }
}

async function removerTarefa(codigo: number) {
  const confirmacao = confirm('Deseja realmente excluir?')
  if (confirmacao) {
    try {
      const tarefaDoc = lista.value.find(i => i.codigo === codigo)
      if (tarefaDoc) {
        await deleteDoc(doc(db, 'tarefas', tarefaDoc.codigo.toString()))
        lista.value = lista.value.filter(i => i.codigo != codigo)
      }
    } catch (e) {
      console.error("Erro ao remover documento: ", e)
    }
  }
}

const naoConcluido = computed(() => lista.value.filter(i => !i.feito))
const concluido = computed(() => lista.value.filter(i => i.feito))

onMounted(() => {
  carregarTarefas()
})
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
