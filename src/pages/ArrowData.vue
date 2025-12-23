<script setup>
import MarkdownRenderer from "../components/MarkdownRenderer.vue";
import potions from "../assets/potions.json"
import items from "../assets/items.json"
import DownloadIcon from "../assets/download.svg";
import CopyIcon from "../assets/copy.svg";
import TickIcon from "../assets/tick.svg";
import {computed, ref, watchEffect} from "vue";
import Combobox from "../components/ComboBox.vue";
import Tooltip from "../components/Tooltip.vue";

const baseDamage = ref(0);
const color = ref(-1);
const effectsList = ref([]);
const effects = computed(() => {
    const obj = {}
    for (const e of effectsList.value) {
        if (e.id && e.duration > 0) {
            obj[e.id] = e.duration
        }
    }
    return obj
});

const flame = ref(false);
const gravity = ref(0.05);
const material = ref("minecraft:air");
const translationKey = ref("item.arrowplus.air_arrow");

const content = computed(() =>
    JSON.stringify(
        {
            baseDamage: baseDamage.value,
            color: color.value,
            effects: effects.value,
            flame: flame.value,
            gravity: gravity.value,
            material: material.value,
            translationKey: translationKey.value
        },
        null,
        2
    )
)

function downloadJson() {
    const blob = new Blob([content.value], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = material.value.substring(material.value.lastIndexOf(":") + 1) + ".json"
    a.click()

    URL.revokeObjectURL(url)
}

const copied = ref(false)

async function copyToClipboard() {
    await navigator.clipboard.writeText(content.value)
    copied.value = true
    setTimeout(() => copied.value = false, 1500)
}

const files = import.meta.glob('../assets/arrows/*.json', { eager: true });
const arrowData = Object.fromEntries(
    Object.entries(files).map(([path, mod]) => [
        path.split("/").pop().replace(".json", ""),
        {
            baseDamage: mod.baseDamage,
            color: mod.color,
            effects: mod.effects,
            flame: mod.flame,
            gravity: mod.gravity,
            material: mod.material,
            translationKey: mod.translationKey
        }
    ])
)

const preset = ref(null);

watchEffect(() => {
    const data = arrowData[preset.value];
    if (preset.value != null) {
        baseDamage.value = data.baseDamage;
        color.value = data.color;
        effectsList.value = Object.entries(data.effects ?? {}).map(
            ([id, duration]) => ({
                id,
                duration
            })
        );
        flame.value = data.flame;
        gravity.value = data.gravity;
        material.value = data.material;
        translationKey.value = data.translationKey;
    }
}, [preset])
</script>

<template>
    <div class="flex w-full h-full">
        <div class="w-7/12 px-10 py-8">
            <div class="flex justify-between items-center">
                <div>
                    <span class="font-semibold text-xl">Arrow Data ({datapack_folder}/arrowplus/arrows/*.json)</span>
                </div>
                <div>
                    <Combobox v-model="preset" :options="Object.keys(arrowData)" placeholder="Default Arrows" :allow-custom-value="false" :style="'bg-zinc-800 p-3 rounded-lg border border-zinc-600'"/>
                </div>
            </div>
            <div class="input-container">
                <span class="input-title">Base Damage</span>
                <input class="input-right" type="number" step="0.1" min="0" v-model="baseDamage">
                <Tooltip class="self-center ms-2" position="right">Base damage of the arrow without power enchantment</Tooltip>
            </div>
            <div class="input-container">
                <span class="input-title">Color</span>
                <input class="input-right" type="number" v-model="color">
                <Tooltip class="self-center ms-2" position="right">Color of the arrow head in decimal converted from ARGB hexadecimal</Tooltip>
            </div>
            <div class="input-container flex-wrap">
                <span class="input-title">Effects</span>
                <input type="button" class="input-right text-start cursor-pointer hover:border-zinc-500 hover:rounded-lg hover:ring-1 hover:ring-zinc-500" @click="effectsList.push({ id: '', duration: 1 })" value="+ Add Effect"/>
                <Tooltip class="self-center ms-2" position="right">Default effect of the arrow (Optional)</Tooltip>

                <div v-for="(effect, index) in effectsList" :key="index" class="flex gap-2 mt-2 ms-5">
                    <div class="effects-container">
                        <span class="input-title">Potion</span>
                        <Combobox v-model="effect.id" :options="potions" placeholder="minecraft:water"/>
                        <Tooltip class="self-center ms-2" position="top">Identifier/ResourceKey of the potion</Tooltip>
                    </div>
                    <div class="effects-container">
                        <span class="input-title">Duration (Ticks)</span>
                        <input class="input-right" type="number" min="1" placeholder="Duration" v-model.number="effect.duration"/>
                        <Tooltip class="self-center ms-2" position="top">Duration of the effect will be applied on target entity</Tooltip>
                    </div>
                    <button @click="effectsList.splice(index, 1)" class="hover:text-zinc-400 cursor-pointer">✕</button>
                </div>
            </div>

            <div class="input-container">
                <span class="input-title">Flame</span>
                <label for="false" class="boolean-input-right-first cursor-pointer">
                    False
                    <input type="radio" v-model="flame" :value="false" id="false">
                </label>
                <label for="true" class="boolean-input-right-second cursor-pointer">
                    True
                    <input type="radio" v-model="flame" :value="true" id="true">
                </label>
                <Tooltip class="self-center ms-2" position="right">Arrow will be flame by default without enchantment</Tooltip>
            </div>
            <div class="input-container">
                <span class="input-title">Gravity</span>
                <input class="input-right" type="number" step="0.1" min="0" v-model="gravity">
                <Tooltip class="self-center ms-2" position="right">Gravity of the arrow, will affect the flying distance</Tooltip>
            </div>
            <div class="input-container">
                <span class="input-title">Material</span>
                <Combobox v-model="material" :options="items" placeholder="minecraft:air"/>
                <Tooltip class="self-center ms-2" position="right">ResourceKey of the item/tags that will be used as crafting material for the arrow</Tooltip>
            </div>
            <div class="input-container">
                <span class="input-title">Translation Key</span>
                <input class="input-right" type="text" v-model="translationKey">
                <Tooltip class="self-center ms-2" position="right">The translation key for the arrow, need to add into en_us.json file</Tooltip>
            </div>
        </div>

        <div class="bg-zinc-800 w-5/12 min-h-[calc(100lvh-4rem)]">
            <div class="border-b border-b-zinc-600 px-3 flex justify-between items-center py-2">
                <div>
                    <span>{{ material.substring(material.lastIndexOf(":") + 1) + ".json" }}</span>
                </div>
                <div class="gap-2 flex">
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