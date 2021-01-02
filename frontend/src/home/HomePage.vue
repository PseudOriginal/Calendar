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
import { mapState } from 'vuex'

export default {
    name: "HomePage",
    computed: {
        ...mapState({
            account: state => state.account
        })
    },
    created () {

    },
    methods: {
    }
};
</script>