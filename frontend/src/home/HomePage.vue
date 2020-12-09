<template>
    <div class="col-sm-6 offset-sm-3">
        <h1>Hi {{account.user.email}}!</h1>
        <p>You're logged in, welcome to our Calendar web app!!</p>
        <p>
            <router-link to="/calendar">My Calendar</router-link>
        </p>
        <p>
            <router-link to="/login">Logout</router-link>
        </p>
    </div>
</template>

<script>
/* 
<h3>Users from secure api end point:</h3>
    <em v-if="users.loading">Loading users...</em>
    <span v-if="users.error" class="text-danger">ERROR: {{users.error}}</span>
    <ul v-if="users.items">
        <li v-for="user in users.items" :key="user.id">
            {{user.email}}
            <span v-if="user.deleting"><em> - Deleting...</em></span>
            <span v-else-if="user.deleteError" class="text-danger"> - ERROR: {{user.deleteError}}</span>
            <span v-else> - <a @click="deleteUser(user.id)" class="text-danger">Delete</a></span>
        </li>
    </ul>
*/

import { mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState({
            account: state => state.account,
            //users: state => state.users.all
        })
    },
    created () {
        //this.getAllUsers();
    },
    methods: {
        /*...mapActions('users', {
            getAllUsers: 'getAll',
            deleteUser: 'delete'
        })*/
    }
};
</script>