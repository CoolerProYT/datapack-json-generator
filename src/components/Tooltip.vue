<template>
    <div class="relative inline-block">
        <!-- Trigger element -->
        <div
            @mouseenter="showTooltip = true"
            @mouseleave="showTooltip = false"
            @focus="showTooltip = true"
            @blur="showTooltip = false"
            class="cursor-pointer"
        >
            <slot name="trigger">
                <button class="border size-5 text-xs text-white rounded-full">
                    ?
                </button>
            </slot>
        </div>

        <!-- Tooltip -->
        <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div
                v-if="showTooltip"
                :class="tooltipClasses"
                class="absolute z-50 px-3 py-2 text-sm text-white bg-zinc-800 rounded shadow-lg whitespace-nowrap pointer-events-none"
            >
                <slot>Tooltip content</slot>

                <!-- Arrow -->
                <div :class="arrowClasses" class="absolute w-2 h-2 bg-zinc-800 transform rotate-45"></div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    position: {
        type: String,
        default: 'top',
        validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
    }
});

const showTooltip = ref(false);

const tooltipClasses = computed(() => {
    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };
    return positions[props.position];
});

const arrowClasses = computed(() => {
    const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
        left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
        right: 'right-full top-1/2 -translate-y-1/2 -mr-1'
    };
    return arrows[props.position];
});
</script>