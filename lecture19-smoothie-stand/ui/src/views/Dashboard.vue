<template>
    <div>
        <h1>Hi, here are your plan!</h1>
        <div class="task-container">
            <div v-for="task in tasks" :key="task.id" class="task-box">
                <h2>{{ task.name }} - {{ task.status }}</h2>
                <p>Description: {{ task.description }}</p>
                <!-- <p>Due Day: {{ task.dueDay }}</p> -->
                <p>Due Day: {{ new Date(Math.floor(task.dueDay)) }}</p>
                <p>Priority: {{ task.priority }}</p>
                <p>Members: {{ task.memberList.join(', ') }}</p>
                <p>Owner: {{ task.owner }}</p>
            </div>
        </div>
    </div>
</template>


<script>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref, watch } from 'vue'

export default {
    setup() {
        const tasks = ref([])

        const { result, loading, error } = useQuery(gql`
      query getUserTasks {
        getUserTasks {
          name
          description
          dueDay
          priority
          memberList
          owner
          status
        }
      }
    `)
        watch(
            () => result.value,
            (newVal) => {
                if (newVal && newVal.getUserTasks) {
                    tasks.value = newVal.getUserTasks
                }
            }
        )

        return {
            tasks,
            loading,
            error
        }
    }
}
</script>

<style scoped>
h1 {
    color: #333;
    margin-bottom: 1rem;
}

.task-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.task-box {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-box h2 {
    margin-top: 0;
}

p {
    margin: 0.5rem 0;
    color: #666;
}
</style>