<script setup>
import {ref} from 'vue'

const features = ref([
    {
        title: 'Arrow Data',
        description: 'Generate custom arrow for Arrow+ mod',
        status: 'Available',
        icon: '🏹',
        available: true,
        link: '/arrowplus/arrow_data'
    },
    {
        title: 'Resources Type',
        description: 'Create resource type definitions for your datapacks',
        status: 'Available',
        icon: '🌳',
        available: true,
        link: '/resourcestrees/resources_type'
    },
    {
        title: 'Fletching Recipes',
        description: 'Generate custom fletching table recipes',
        status: 'Available',
        icon: '🛠️',
        available: true,
        link: '/fletchingrecipe'
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
        </div>
    </div>
</template>