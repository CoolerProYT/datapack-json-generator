<script setup>
import {ref} from 'vue'

const features = ref([
    {
        title: 'Arrow Data',
        description: 'Generate custom arrow for Arrow+ mod',
        status: 'Available',
        icon: '🏹',
        available: true,
        link: '/arrow+/arrow_data'
    },
    {
        title: 'Resources Trees',
        description: 'Create resource type definitions for your datapacks',
        status: 'Coming Soon',
        icon: '🌳',
        available: false,
        link: '/'
    },
    {
        title: 'Fletching Recipes',
        description: 'Design custom fletching table recipes',
        status: 'Coming Soon',
        icon: '🛠️',
        available: false,
        link: '/'
    }
])
</script>

<template>
    <div
        class="min-h-[calc(100lvh-4rem)] w-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 px-4 py-12">
        <div class="max-w-5xl w-full">
            <!-- Hero Section -->
            <div class="text-center mb-16">
                <h1 class="text-5xl font-bold text-zinc-100 mb-4">
                    Datapack JSON Generator
                </h1>
                <p class="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                    A powerful toolkit for Minecraft players and modpack developers to generate datapack JSON files for CoolerProMC mods
                </p>
            </div>

            <!-- Features Grid -->
            <div class="grid md:grid-cols-3 gap-6 mb-12">
                <router-link
                    v-for="feature in features"
                    :to="feature.link"
                    :key="feature.title"
                    :class="['bg-zinc-800 border border-zinc-700 rounded-lg p-6 shadow-lg transition-all duration-300', feature.available ? 'hover:shadow-2xl hover:shadow-zinc-900/50 hover:-translate-y-1 hover:border-zinc-600 cursor-pointer' : 'opacity-60']">
                    <div class="text-4xl mb-4">{{ feature.icon }}</div>
                    <h3 class="text-xl font-semibold text-zinc-100 mb-2">
                        {{ feature.title }}
                    </h3>
                    <p class="text-zinc-400 mb-4 text-sm leading-relaxed">
                        {{ feature.description }}
                    </p>
                    <span :class="['inline-block px-3 py-1 rounded-full text-xs font-medium', feature.available ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30']">
                        {{ feature.status }}
                    </span>
                </router-link>
            </div>

            <!-- Call to Action -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-center shadow-lg">
                <h2 class="text-2xl font-bold text-white mb-3">
                    Ready to Get Started?
                </h2>
                <p class="text-blue-100 mb-6">
                    Navigate to Arrow Data using the menu to begin creating your custom configurations
                </p>
                <router-link to="/arrow+/arrow_data"
                    class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-100 transition-colors shadow-md">
                    View Documentation
                </router-link>
            </div>

            <!-- Info Banner -->
            <div class="mt-8 bg-zinc-800 border border-zinc-700 rounded-lg p-6 text-center">
                <p class="text-zinc-400 text-sm">
                    Currently supporting <span class="text-zinc-100 font-semibold">Arrow+</span> mod •
                    More features coming soon
                </p>
            </div>
        </div>
    </div>
</template>