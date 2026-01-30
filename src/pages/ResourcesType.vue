<script setup>
import { computed, ref } from "vue";
import Combobox from "../components/ComboBox.vue";
import Tooltip from "../components/Tooltip.vue";
import MarkdownRenderer from "../components/MarkdownRenderer.vue";
import DownloadIcon from "../assets/download.svg";
import CopyIcon from "../assets/copy.svg";
import TickIcon from "../assets/tick.svg";
import items from "../assets/items.json";

const color = ref(-6543440);
const leafDropChance = ref(0.25);
const material = ref("minecraft:amethyst_block");
const saplingDropChance = ref(0.125);
const treeSimulatorTicks = ref(800);
const weight = ref(5);

const content = computed(() =>
    JSON.stringify(
        {
            color: color.value,
            leafDropChance: leafDropChance.value,
            material: material.value,
            saplingDropChance: saplingDropChance.value,
            treeSimulatorTicks: treeSimulatorTicks.value,
            weight: weight.value
        },
        null,
        2
    )
);

function downloadJson() {
    const blob = new Blob([content.value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = material.value.substring(material.value.lastIndexOf(":") + 1) + ".json";
    a.click();
    URL.revokeObjectURL(url);
}

const copied = ref(false);

async function copyToClipboard() {
    await navigator.clipboard.writeText(content.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
}

// Helper function to convert hex color to decimal
const hexColor = ref("9F9F9F");
const updateColorFromHex = () => {
    try {
        const hex = hexColor.value.replace("#", "");
        if (hex.length === 6) {
            // Add FF for alpha channel (fully opaque)
            const argb = "FF" + hex;
            // Convert to signed 32-bit integer
            const decimal = parseInt(argb, 16);
            color.value = decimal > 2147483647 ? decimal - 4294967296 : decimal;
        }
    } catch (e) {
        console.error("Invalid hex color");
    }
};

// Helper function to convert decimal to hex color
const updateHexFromColor = () => {
    try {
        // Convert signed to unsigned
        const unsigned = color.value < 0 ? color.value + 4294967296 : color.value;
        // Convert to hex and remove alpha channel
        const hex = unsigned.toString(16).toUpperCase().padStart(8, '0').substring(2);
        hexColor.value = hex;
    } catch (e) {
        console.error("Invalid color value");
    }
};

// Initialize hex color from default value
updateHexFromColor();
</script>

<template>
    <div class="flex flex-col lg:flex-row w-full h-full">
        <div class="w-full lg:w-7/12 px-4 sm:px-10 py-8">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-0">
                <div>
                    <span class="font-semibold text-xl">Custom Resources Type</span>
                    <br>
                    <span class="text-sm text-zinc-400">&lt;namespace&gt;/resourcestrees/resources_type/{{ material.substring(material.lastIndexOf(":") + 1) }}.json
          </span>
                </div>
            </div>

            <div class="bg-blue-900/20 border border-blue-700 rounded-lg p-4 my-4">
                <p class="text-sm text-blue-200">
                    You can add as many resources types to the game as you want. But it must be placed under
                    <code class="bg-zinc-900 px-2 py-1 rounded text-xs">
                        &lt;namespace&gt;/resourcestrees/resources_type/*.json
                    </code>
                </p>
            </div>

            <div class="input-container">
                <span class="input-title">Color (Decimal)</span>
                <input class="input-right" type="number" v-model.number="color" @input="updateHexFromColor">
                <Tooltip class="self-center ms-2" position="right">
                    ARGB color value of the resources type, converted from hexadecimal such as FFA3C4B1
                </Tooltip>
            </div>

            <div class="input-container">
                <span class="input-title">Color (Hex)</span>
                <div class="flex items-center gap-2 flex-1">
                    <input
                        class="input-right"
                        type="text"
                        v-model="hexColor"
                        @input="updateColorFromHex"
                        placeholder="9F9F9F"
                        maxlength="6"
                    >
                    <div
                        class="w-10 h-10 rounded border border-zinc-600 shrink-0"
                        :style="{ backgroundColor: '#' + hexColor }"
                    ></div>
                </div>
                <Tooltip class="self-center ms-2" position="right">
                    Hex color without alpha channel (RGB only). Use online converter to get ARGB decimal value
                </Tooltip>
            </div>

            <div class="input-container">
                <span class="input-title">Leaf Drop Chance</span>
                <input class="input-right" type="number" step="0.01" min="0" max="1" v-model.number="leafDropChance">
                <Tooltip class="self-center ms-2" position="right">
                    Chance for second leaf fragment to drop when breaking resources leaves, from 0.0 - 1.0
                </Tooltip>
            </div>

            <div class="input-container">
                <span class="input-title">Material</span>
                <Combobox v-model="material" :options="items" placeholder="minecraft:amethyst_block"/>
                <Tooltip class="self-center ms-2" position="right">
                    Item Id of the material item for the resources type, but this is currently useless for custom types, defined for datagen purpose only
                </Tooltip>
            </div>

            <div class="input-container">
                <span class="input-title">Sapling Drop Chance</span>
                <input class="input-right" type="number" step="0.01" min="0" max="1" v-model.number="saplingDropChance">
                <Tooltip class="self-center ms-2" position="right">
                    Chance for sapling to drop when breaking resources leaves, from 0.0 - 1.0
                </Tooltip>
            </div>

            <div class="input-container">
                <span class="input-title">Tree Simulator Ticks</span>
                <input class="input-right" type="number" step="1" min="1" v-model.number="treeSimulatorTicks">
                <Tooltip class="self-center ms-2" position="right">
                    The amount of ticks required for a sapling to grow into a tree (20 ticks = 1 second)
                </Tooltip>
            </div>

            <div class="input-container">
                <span class="input-title">Weight</span>
                <input class="input-right" type="number" step="1" min="1" v-model.number="weight">
                <Tooltip class="self-center ms-2" position="right">
                    This field is not using anymore, will be removed in future version
                </Tooltip>
            </div>
        </div>

        <div class="bg-zinc-800 w-full lg:w-5/12 min-h-[50vh] lg:min-h-[calc(100lvh-4rem)]">
            <div class="border-b border-b-zinc-600 px-3 flex justify-between items-center py-2">
                <div class="truncate mr-2">
                    <span>{{ material.substring(material.lastIndexOf(":") + 1) }}.json</span>
                </div>
                <div class="gap-2 flex shrink-0">
                    <button class="p-2 bg-green-700 hover:bg-green-600 text-white rounded-lg cursor-pointer" @click="downloadJson">
                        <DownloadIcon class="size-6 fill-white" />
                    </button>
                    <button class="p-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg cursor-pointer" @click="copyToClipboard">
                        <TickIcon class="size-6 stroke-white" v-if="copied" />
                        <CopyIcon class="size-6 stroke-white" v-if="!copied" />
                    </button>
                </div>
            </div>
            <MarkdownRenderer :source="content" />
        </div>
    </div>
</template>