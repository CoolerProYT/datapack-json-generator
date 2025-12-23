<script setup>
import {computed} from "vue"
import hljs from "highlight.js/lib/core"
import config from "highlight.js/lib/languages/ini"
import json from "highlight.js/lib/languages/json"
import "highlight.js/styles/atom-one-dark.css"

const props = defineProps({
    source: {
        type: String,
        default: ""
    }
})

hljs.registerLanguage("config", config)
hljs.registerLanguage("json", json)

const highlighted = computed(() => {
    if(!props.source) return ""
    return hljs.highlight(props.source, {language: "json"}).value
})
</script>

<template>
    <pre class="whitespace-break-spaces"><code v-html="highlighted" class="hljs language-json"></code></pre>
</template>
