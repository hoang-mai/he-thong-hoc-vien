<template>
    <Header />
        <LeftSideBar />
        <div class="md:ml-64 ml-52">
            <RouterView />
        </div>
</template>
<script setup lang="ts">

import LeftSideBar from './LeftSideBar.vue';
import Header from './header/Header.vue';

</script>