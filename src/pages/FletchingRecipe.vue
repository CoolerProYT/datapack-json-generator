<script setup>
import { computed, ref } from "vue";
import Combobox from "../components/ComboBox.vue";
import Tooltip from "../components/Tooltip.vue";
import MarkdownRenderer from "../components/MarkdownRenderer.vue";
import DownloadIcon from "../assets/download.svg";
import CopyIcon from "../assets/copy.svg";
import TickIcon from "../assets/tick.svg";
import items from "../assets/items.json";

const minecraftVersions = ["1.20.1", "1.21.1", "1.21.10"];
const modLoaders = {
    "1.20.1": ["Forge", "Fabric"],
    "1.21.1": ["NeoForge", "Fabric"],
    "1.21.10": ["Forge", "NeoForge", "Fabric"]
};

const minecraftVersion = ref("1.21.10");
const modLoader = ref("Fabric");

const topCount = ref(1);
const topItem = ref("minecraft:lingering_potion");
const topUseComponent = ref(false);
const topComponents = ref([{ key: "minecraft:potion_contents", value: '{"potion":"minecraft:awkward"}' }]);

const middleCount = ref(8);
const middleItem = ref("minecraft:arrow");
const middleUseComponent = ref(false);
const middleComponents = ref([]);

const bottomEnabled = ref(false);
const bottomCount = ref(1);
const bottomItem = ref("minecraft:lingering_potion");
const bottomUseComponent = ref(false);
const bottomComponents = ref([]);

const outputCount = ref(8);
const outputItem = ref("minecraft:tipped_arrow");
const outputComponents = ref([{ key: "minecraft:potion_contents", value: '{"potion":"minecraft:awkward"}' }]);

const availableModLoaders = computed(() => modLoaders[minecraftVersion.value] || []);

// Auto-adjust modLoader when version changes
const updateModLoader = () => {
    const available = availableModLoaders.value;
    if (!available.includes(modLoader.value)) {
        modLoader.value = available[0];
    }
};

const parseComponentValue = (value) => {
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

const createIngredient = (item, count, useComponent, components) => {
    const version = minecraftVersion.value;
    const loader = modLoader.value;

    if (!useComponent) {
        // Simple ingredient
        if (version === "1.21.10") {
            return { count, ingredient: item };
        }
        return { count, ingredient: { item } };
    }

    // Component ingredient
    const componentsObj = {};
    components.forEach(c => {
        if (c.key) componentsObj[c.key] = parseComponentValue(c.value);
    });

    if (version === "1.20.1") {
        if (loader === "Fabric") {
            return {
                count,
                ingredient: {
                    "fabric:type": "fabric:nbt",
                    base: { item },
                    nbt: componentsObj,
                    strict: true
                }
            };
        } else {
            // Forge 1.20.1 uses NBT strings
            const nbtString = JSON.stringify(componentsObj).replace(/"/g, '\\"');
            return {
                count,
                ingredient: {
                    type: "forge:nbt",
                    count,
                    item,
                    nbt: `{${Object.entries(componentsObj).map(([k, v]) => `${k.split(':')[1]}:\\"${typeof v === 'object' ? v.potion : v}\\"`).join(',')}}`
                }
            };
        }
    }

    if (version === "1.21.1") {
        if (loader === "Fabric") {
            return {
                count,
                ingredient: {
                    "fabric:type": "fabric:components",
                    base: { item },
                    components: componentsObj
                }
            };
        } else {
            // NeoForge
            return {
                count,
                ingredient: {
                    type: "neoforge:components",
                    components: componentsObj,
                    items: item,
                    strict: true
                }
            };
        }
    }

    if (version === "1.21.10") {
        if (loader === "Fabric") {
            return {
                count,
                ingredient: {
                    "fabric:type": "fabric:components",
                    base: item,
                    components: componentsObj
                }
            };
        } else if (loader === "NeoForge") {
            return {
                count,
                ingredient: {
                    "neoforge:ingredient_type": "neoforge:components",
                    components: componentsObj,
                    items: item,
                    strict: true
                }
            };
        } else {
            // Forge
            return {
                count,
                ingredient: {
                    type: "fletchingrecipe:data_component",
                    components: componentsObj,
                    items: item,
                    strict: true
                }
            };
        }
    }
};

const content = computed(() => {
    const recipe = {
        type: "fletchingrecipe:fletching",
        top: createIngredient(topItem.value, topCount.value, topUseComponent.value, topComponents.value),
        middle: createIngredient(middleItem.value, middleCount.value, middleUseComponent.value, middleComponents.value)
    };

    if (bottomEnabled.value) {
        recipe.bottom = createIngredient(bottomItem.value, bottomCount.value, bottomUseComponent.value, bottomComponents.value);
    }

    const outputComponentsObj = {};
    outputComponents.value.forEach(c => {
        if (c.key) outputComponentsObj[c.key] = parseComponentValue(c.value);
    });

    if (minecraftVersion.value === "1.20.1") {
        recipe.output = {
            count: outputCount.value,
            item: outputItem.value
        };
        if (Object.keys(outputComponentsObj).length > 0) {
            recipe.output.nbt = outputComponentsObj;
        }
    } else {
        recipe.output = {
            count: outputCount.value,
            id: outputItem.value
        };
        if (Object.keys(outputComponentsObj).length > 0) {
            recipe.output.components = outputComponentsObj;
        }
    }

    return JSON.stringify(recipe, null, 2);
});

function downloadJson() {
    const blob = new Blob([content.value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${outputItem.value.split(':')[1]}_recipe.json`;
    a.click();
    URL.revokeObjectURL(url);
}

const copied = ref(false);

async function copyToClipboard() {
    await navigator.clipboard.writeText(content.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
    <div class="flex flex-col lg:flex-row w-full h-full">
        <div class="w-full lg:w-7/12 px-4 sm:px-10 py-8 overflow-y-auto">
            <div class="mb-6">
                <span class="font-semibold text-xl">Fletching Recipe</span>
                <br />
                <span class="text-sm text-zinc-400">Generate fletching table recipes for different mod loaders</span>
            </div>

            <!-- Version and ModLoader Selection -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div class="effects-container">
                    <label class="input-title">Version</label>
                    <Combobox
                        v-model="minecraftVersion"
                        :options="minecraftVersions"
                        :allow-custom-value="false"
                        @update:model-value="updateModLoader"
                    />
                    <Tooltip class="self-center ms-2" position="top">1.20.1/1.21.1/1.21.10</Tooltip>
                </div>
                <div class="effects-container">
                    <label class="input-title">Mod Loader</label>
                    <Combobox
                        v-model="modLoader"
                        :options="availableModLoaders"
                        :allow-custom-value="false"
                    />
                    <Tooltip class="self-center ms-2" position="top">NeoForge/Fabric/Forge</Tooltip>
                </div>
            </div>

            <div class="mb-5">
                <a v-if="minecraftVersion !== '1.20.1'" class="text-blue-400" href="https://minecraft.wiki/w/Data_component_format#List_of_components" target="_blank">Click here to view all vanilla components.</a>
                <a v-else class="text-blue-400" href="https://minecraft.wiki/w/Item_format/Before_1.20.5" target="_blank">Click here to view all vanilla NBT.</a>
            </div>

            <!-- Top Slot -->
            <div class="bg-zinc-800 p-4 rounded-lg mb-4">
                <div class="flex items-center justify-between mb-3">
                    <span class="font-semibold">Top Slot</span>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="topUseComponent" class="cursor-pointer" />
                        <span class="text-sm">Use {{ minecraftVersion === '1.20.1' ? 'NBT' : 'Components' }}</span>
                    </label>
                </div>
                <div class="input-container">
                    <span class="input-title">Item</span>
                    <Combobox v-model="topItem" :options="items" placeholder="minecraft:air"/>
                    <Tooltip v-if="minecraftVersion !== '1.21.10'" class="self-center ms-2" position="top">For tag ingredient, you need to modify it to "tag": "key" instead of "item": "#key"</Tooltip>
                </div>
                <div class="input-container">
                    <span class="input-title">Count</span>
                    <input class="input-right" type="number" min="1" v-model.number="topCount" />
                </div>
                <div v-if="topUseComponent" class="mt-3">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium">{{ minecraftVersion === '1.20.1' ? 'NBT Data' : 'Components' }}</span>
                        <button
                            @click="topComponents.push({ key: '', value: '' })"
                            class="text-sm px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded"
                        >
                            + Add
                        </button>
                    </div>
                    <div v-for="(comp, idx) in topComponents" :key="idx" class="flex gap-2 mb-2">
                        <input
                            class="flex-1 p-2 bg-zinc-900 border border-zinc-600 rounded"
                            type="text"
                            v-model="comp.key"
                            placeholder="Key (e.g., minecraft:potion_contents)"
                        />
                        <input
                            class="flex-1 p-2 bg-zinc-900 border border-zinc-600 rounded"
                            type="text"
                            v-model="comp.value"
                            placeholder='Value (e.g., {"potion":"minecraft:awkward"})'
                        />
                        <button @click="topComponents.splice(idx, 1)" class="px-3 hover:text-zinc-400">✕</button>
                    </div>
                </div>
            </div>

            <!-- Middle Slot -->
            <div class="bg-zinc-800 p-4 rounded-lg mb-4">
                <div class="flex items-center justify-between mb-3">
                    <span class="font-semibold">Middle Slot</span>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="middleUseComponent" class="cursor-pointer" />
                        <span class="text-sm">Use {{ minecraftVersion === '1.20.1' ? 'NBT' : 'Components' }}</span>
                    </label>
                </div>
                <div class="input-container">
                    <span class="input-title">Item</span>
                    <Combobox v-model="middleItem" :options="items" placeholder="minecraft:air"/>
                    <Tooltip v-if="minecraftVersion !== '1.21.10'" class="self-center ms-2" position="top">For tag ingredient, you need to modify it to "tag": "key" instead of "item": "#key"</Tooltip>
                </div>
                <div class="input-container">
                    <span class="input-title">Count</span>
                    <input class="input-right" type="number" min="1" v-model.number="middleCount" />
                </div>
                <div v-if="middleUseComponent" class="mt-3">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium">{{ minecraftVersion === '1.20.1' ? 'NBT Data' : 'Components' }}</span>
                        <button
                            @click="middleComponents.push({ key: '', value: '' })"
                            class="text-sm px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded"
                        >
                            + Add
                        </button>
                    </div>
                    <div v-for="(comp, idx) in middleComponents" :key="idx" class="flex gap-2 mb-2">
                        <input
                            class="flex-1 p-2 bg-zinc-900 border border-zinc-600 rounded"
                            type="text"
                            v-model="comp.key"
                            placeholder="Key"
                        />
                        <input
                            class="flex-1 p-2 bg-zinc-900 border border-zinc-600 rounded"
                            type="text"
                            v-model="comp.value"
                            placeholder="Value"
                        />
                        <button @click="middleComponents.splice(idx, 1)" class="px-3 hover:text-zinc-400">✕</button>
                    </div>
                </div>
            </div>

            <!-- Bottom Slot (Optional) -->
            <div class="bg-zinc-800 p-4 rounded-lg mb-4">
                <div class="flex items-center justify-between mb-3">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="bottomEnabled" class="cursor-pointer" />
                        <span class="font-semibold">Bottom Slot (Optional)</span>
                    </label>
                    <label v-if="bottomEnabled" class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" v-model="bottomUseComponent" class="cursor-pointer" />
                        <span class="text-sm">Use {{ minecraftVersion === '1.20.1' ? 'NBT' : 'Components' }}</span>
                    </label>
                </div>
                <div v-if="bottomEnabled">
                    <div class="input-container">
                        <span class="input-title">Item</span>
                        <Combobox v-model="bottomItem" :options="items" placeholder="minecraft:air"/>
                        <Tooltip v-if="minecraftVersion !== '1.21.10'" class="self-center ms-2" position="top">For tag ingredient, you need to modify it to "tag": "key" instead of "item": "#key"</Tooltip>
                    </div>
                    <div class="input-container">
                        <span class="input-title">Count</span>
                        <input class="input-right" type="number" min="1" v-model.number="bottomCount" />
                    </div>
                    <div v-if="bottomUseComponent" class="mt-3">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium">{{ minecraftVersion === '1.20.1' ? 'NBT Data' : 'Components' }}</span>
                            <button
                                @click="bottomComponents.push({ key: '', value: '' })"
                                class="text-sm px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded"
                            >
                                + Add
                            </button>
                        </div>
                        <div v-for="(comp, idx) in bottomComponents" :key="idx" class="flex gap-2 mb-2">
                            <input
                                class="flex-1 p-2 bg-zinc-900 border border-zinc-600 rounded"
                                type="text"
                                v-model="comp.key"
                                placeholder="Key"
                            />
                            <input
                                class="flex-1 p-2 bg-zinc-900 border border-zinc-600 rounded"
                                type="text"
                                v-model="comp.value"
                                placeholder="Value"
                            />
                            <button @click="bottomComponents.splice(idx, 1)" class="px-3 hover:text-zinc-400">✕</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Output -->
            <div class="bg-zinc-800 p-4 rounded-lg">
                <span class="font-semibold block mb-3">Output</span>
                <div class="input-container">
                    <span class="input-title">Item</span>
                    <Combobox v-model="outputItem" :options="items" placeholder="minecraft:air"/>
                </div>
                <div class="input-container">
                    <span class="input-title">Count</span>
                    <input class="input-right" type="number" min="1" v-model.number="outputCount" />
                </div>
                <div class="mt-3">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium">{{ minecraftVersion === '1.20.1' ? 'NBT Data' : 'Components' }} (Optional)</span>
                        <button
                            @click="outputComponents.push({ key: '', value: '' })"
                            class="text-sm px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded"
                        >
                            + Add
                        </button>
                    </div>
                    <div v-for="(comp, idx) in outputComponents" :key="idx" class="flex gap-2 mb-2">
                        <input
                            class="flex-1 p-2 bg-zinc-900 border border-zinc-600 rounded"
                            type="text"
                            v-model="comp.key"
                            placeholder="Key"
                        />
                        <input
                            class="flex-1 p-2 bg-zinc-900 border border-zinc-600 rounded"
                            type="text"
                            v-model="comp.value"
                            placeholder="Value"
                        />
                        <button @click="outputComponents.splice(idx, 1)" class="px-3 hover:text-zinc-400">✕</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Preview Panel -->
        <div class="bg-zinc-800 w-full lg:w-5/12 min-h-[50vh] lg:min-h-[calc(100lvh-4rem)]">
            <div class="border-b border-b-zinc-600 px-3 flex justify-between items-center py-2">
                <div class="truncate mr-2">
                    <span>{{ outputItem.split(':')[1] }}_recipe.json</span>
                </div>
                <div class="gap-2 flex shrink-0">
                    <button
                        class="p-2 bg-green-700 hover:bg-green-600 text-white rounded-lg cursor-pointer"
                        @click="downloadJson"
                    >
                        <DownloadIcon class="size-6 fill-white" />
                    </button>
                    <button
                        class="p-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg cursor-pointer"
                        @click="copyToClipboard"
                    >
                        <TickIcon class="size-6 stroke-white" v-if="copied" />
                        <CopyIcon class="size-6 stroke-white" v-if="!copied" />
                    </button>
                </div>
            </div>
            <MarkdownRenderer :source="content" />
        </div>
    </div>
</template>

