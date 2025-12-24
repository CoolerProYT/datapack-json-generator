<script setup>
import DropdownLink from "./DropdownLink.vue";
import logo from "../assets/logo.png";
</script>

<template>
    <div class="w-full bg-zinc-800 px-3 md:px-10 xl:px-20 h-16 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div class="hidden md:block">
            <router-link to="/">
                <img :src="logo" class="h-8 md:h-10" />
            </router-link>
        </div>
        <div class="flex items-center gap-5">
            <a href="https://coolerpromc.com" class="hover:text-blue-400">Go to Main Website</a>
            <DropdownLink />
        </div>
    </div>
</template>

<style scoped>

</style>