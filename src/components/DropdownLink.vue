<template>
    <div class="relative inline-block">
        <button
            @click="toggleDropdown"
            class="flex items-center justify-between min-w-[150px] px-5 py-2.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 focus:bg-zinc-700 focus:outline-none cursor-pointer"
        >
            {{ currentRouteName }}
            <span class="ml-2.5 text-xs">▼</span>
        </button>

        <div v-if="isOpen" class="absolute left-0 mt-1 min-w-[150px] bg-zinc-800 border border-zinc-600 rounded shadow-lg z-50">
            <router-link
                v-for="route in routes"
                :key="route.path"
                :to="route.path"
                class="block px-5 py-2.5 text-zinc-100 no-underline hover:bg-zinc-700 transition-colors router-link-active:bg-blue-500 router-link-active:text-white"
                @click="closeDropdown"
            >
                {{ route.name }}
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RouterDropdown',
    data() {
        return {
            isOpen: false,
            routes: [
                { path: '/', name: 'Home' },
                { path: '/arrowplus/arrow_data', name: 'Arrow Data' }
            ]
        }
    },
    computed: {
        currentRouteName() {
            const currentPath = this.$route.path;
            const currentRoute = this.routes.find(route => route.path === currentPath);
            return currentRoute ? currentRoute.name : 'Select Page';
        }
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        closeDropdown() {
            this.isOpen = false;
        }
    },
    mounted() {
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.$el.contains(e.target)) {
                this.isOpen = false;
            }
        });
    }
}
</script>