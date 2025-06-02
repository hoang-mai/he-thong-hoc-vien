<template>
    <Header />
    <LeftSideBar />
    <div class="md:ml-64 ml-52">
        <RouterView />
    </div>
</template>
<script setup lang="ts">

import Header from './header/Header.vue';
import LeftSideBar from './LeftSideBar.vue';


</script>