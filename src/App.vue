<script setup lang="ts">
import { computed, ref } from 'vue'

const tarefa = ref('')
const lista = ref<Tarefa[]>([])
let incremento = 0
type Tarefa = {
  codigo: number
  feito: boolean
  nome: string
}
function cadastrarTarefa(evento: Event) {
  evento.preventDefault()
  lista.value.push({
    codigo: incremento,
    nome: tarefa.value,
    feito: false,
  })
  incremento++
  tarefa.value = ''
}
function removerTarefa(codigo: number) {
  const confirmacao = confirm('Deseja realmente excluir?')
  if (confirmacao) {
    lista.value = lista.value.filter(i => i.codigo != codigo)
  }
}

const naoConcluido = computed(() => lista.value.filter(i => !i.feito))
const concluido = computed(() => lista.value.filter(i => i.feito))
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
}
</style>
