<template>
    <div class="create-task-container">
      <h1>Create Task</h1>
      <form @submit.prevent="submitTask" class="row g-3">
        <div class="mb-3">
          <label for="taskName" class="visually-hidden">Name</label>
          <input type="text" class="form-control" id="taskName" v-model="taskInfo.name" placeholder="Name" required>
        </div>
        
        <div class="mb-3">
          <label for="description" class="visually-hidden">Description</label>
          <textarea class="form-control" id="description" v-model="taskInfo.description" rows="3" placeholder="Description"></textarea>
        </div>
        
        <div class="mb-3">
          <label for="dueDay" class="visually-hidden">Due Date</label>
          <input type="date" class="form-control" id="dueDay" v-model="taskInfo.dueDay" required>
        </div>
        
        <div class="mb-3">
          <label for="priority" class="visually-hidden">Priority</label>
          <select class="form-select" id="priority" v-model="taskInfo.priority">
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
        </div>
        
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="recurring" v-model="taskInfo.isRecur">
          <label class="form-check-label" for="recurring">Recurring</label>
        </div>
        
        <div class="mb-3" v-if="taskInfo.isRecur">
          <label for="period" class="visually-hidden">Period</label>
          <select class="form-select" id="period" v-model="taskInfo.recurPeriod">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        
        <div class="mb-3">
          <label for="assignTo" class="visually-hidden">Assign to</label>
          <input type="text" class="form-control" id="assignTo" placeholder="Search for users" v-model="searchText" @input="searchUsersDebounced">
          <ul class="list-group mt-2" v-if="searchResults.length && searchResults[0] !== 'No matches found'">
            <li class="list-group-item" v-for="user in searchResults" :key="user.id" @click="selectUser(user)">
              {{ user.username }}
            </li>
          </ul>
          <p class="text-danger" v-else-if="searchResults[0] === 'No matches found'">No matches found</p>
        </div>
        
        <div class="mb-3 selected-users">
          <div class="badge bg-secondary" v-for="user in selectedUsers" :key="user.id">
            {{ user.username }}
            <button type="button" class="btn-close" @click="removeUser(user)"></button>
          </div>
        </div>
        
        <div class="mb-3">
          <button type="submit" class="btn btn-primary mb-3">Create Task</button>
        </div>
      </form>
    </div>
  </template>
  
  
  <script setup>
  import { reactive, ref, watch } from 'vue';
  import { createTask, searchUsers } from '../data';
  import { debounce } from 'lodash-es';
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const searchText = ref('');
  const searchResults = ref([]);
  const selectedUsers = ref([]);
  
  const taskInfo = reactive({
    name: '',
    description: '',
    dueDay: '',
    priority: 1,
    isRecur: false,
    recurPeriod: 'Daily',
    memberList: [],
    owner: '',  // 需要设置默认的 owner 或在 UI 中允许选择
  });
  
  const submitTask = async () => {
    taskInfo.dueDay = new Date(taskInfo.dueDay).toISOString();  // 保证日期格式符合 ISO 标准
    taskInfo.memberList = selectedUsers.value.map(u => u.id);  // 转换 selectedUsers 为 ID 列表
    
    const response = await createTask(taskInfo);
    if (response.success) {
      alert(response.message)
      router.push('/dashboard')
    } else {
      alert(response.error);
    }
  };
  
  const searchUsersDebounced = debounce(async () => {
    const query = searchText.value;
    if (query) {
      try {
        const response = await searchUsers(query);
        // 假设searchUsers函数适当地处理了响应，并且response.users是一个用户对象数组
        searchResults.value = response.users || ['No matches found'];
      } catch (error) {
        console.error("Error searching users:", error);
        searchResults.value = ['No matches found'];
      }
    } else {
      searchResults.value = [];
    }
  }, 500);
  
  watch(searchText, () => {
    searchUsersDebounced();
  });
  
  function selectUser(user) {
    if (!selectedUsers.value.find(u => u.id === user.id)) {
      selectedUsers.value.push(user);
      searchText.value = '';
      searchResults.value = [];
    }
  }
  
  function removeUser(user) {
    selectedUsers.value = selectedUsers.value.filter(u => u.id !== user.id);
  }
  </script>
  
  <style>
  .create-task-container {
    width: 400px;
    margin: auto;
  }
  
  /* 新添加的样式类 */
  .input-sm {
    max-width: 300px;
  }
  </style>
  
  