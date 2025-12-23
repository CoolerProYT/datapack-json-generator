<template>
    <div class="relative" ref="comboboxWrapper">
        <div class="relative flex items-center">
            <input
                :id="inputId"
                ref="input"
                type="text"
                v-model="searchQuery"
                @input="onInput"
                @focus="onFocus"
                @blur="onBlur"
                @keydown="onKeyDown"
                :placeholder="placeholder"
                :aria-expanded="isOpen"
                :aria-autocomplete="'list'"
                :aria-controls="listId"
                :aria-activedescendant="activeDescendant"
                :class="style"
                role="combobox"
            />

            <button type="button" @click="toggleDropdown" class="absolute right-2 flex items-center justify-center p-1 hover:text-gray-500 transition-colors" tabindex="-1" :aria-label="isOpen ? 'Close options' : 'Open options'">
                <svg :class="['w-4 h-4 transition-transform', { 'rotate-180': isOpen }]" viewBox="0 0 16 16">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" />
                </svg>
            </button>
        </div>

        <ul v-show="isOpen && filteredOptions.length > 0" :id="listId" ref="listbox" class="absolute z-50 min-w-full w-fit mt-1 max-h-60 overflow-y-auto bg-zinc-800 border border-zinc-600 rounded-md shadow-lg p-1" role="listbox">
            <li
                v-for="(option, index) in filteredOptions"
                :key="getOptionValue(option)"
                :id="`${listId}-option-${index}`"
                @click="selectOption(option)"
                @mouseenter="highlightedIndex = index"
                :class="[
          'px-3 py-2 cursor-pointer rounded transition-colors select-none',
          index === highlightedIndex ? 'bg-zinc-700' : '',
          isSelected(option) ? 'bg-zinc-700 text-zinc-200 font-medium' : 'text-zinc-200'
        ]"
                role="option"
                :aria-selected="isSelected(option)"
            >
                {{ getOptionLabel(option) }}
            </li>
        </ul>

        <div
            v-show="isOpen && filteredOptions.length === 0 && searchQuery"
            class="absolute z-50 w-full mt-1 px-3 py-2 text-sm text-center text-zinc-200 bg-zinc-800 border border-zinc-600 rounded-md shadow-lg"
        >
            No options found
        </div>
    </div>
</template>

<script>
export default {
    name: 'Combobox',

    props: {
        modelValue: {
            type: [String, Number, Object],
            default: null
        },
        options: {
            type: Array,
            required: true
        },
        label: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Select an option...'
        },
        optionLabel: {
            type: String,
            default: 'label'
        },
        optionValue: {
            type: String,
            default: 'value'
        },
        filterMethod: {
            type: Function,
            default: null
        },
        allowCustomValue: {
            type: Boolean,
            default: true
        },
        style: {
            type: String,
            default: "input-right"
        }
    },

    emits: ['update:modelValue', 'change'],

    data() {
        return {
            searchQuery: '',
            isOpen: false,
            highlightedIndex: -1,
            inputId: `combobox-${Math.random().toString(36).substr(2, 9)}`,
            listId: `listbox-${Math.random().toString(36).substr(2, 9)}`
        };
    },

    computed: {
        filteredOptions() {
            if (!this.searchQuery) {
                return this.options;
            }

            if (this.filterMethod) {
                return this.filterMethod(this.options, this.searchQuery);
            }

            const query = this.searchQuery.toLowerCase();
            return this.options.filter(option => {
                const label = this.getOptionLabel(option).toLowerCase();
                return label.includes(query);
            });
        },

        activeDescendant() {
            if (this.highlightedIndex >= 0) {
                return `${this.listId}-option-${this.highlightedIndex}`;
            }
            return '';
        }
    },

    watch: {
        modelValue: {
            immediate: true,
            handler(newVal) {
                if (newVal !== null && newVal !== undefined) {
                    // Check if it's an option from the array
                    const option = this.options.find(opt =>
                        this.getOptionValue(opt) === this.getOptionValue(newVal)
                    );

                    if (option) {
                        this.searchQuery = this.getOptionLabel(option);
                    } else if (this.allowCustomValue) {
                        // It's a custom value - only update if different from current searchQuery
                        const newQuery = typeof newVal === 'object' ? this.getOptionLabel(newVal) : String(newVal);
                        if (this.searchQuery !== newQuery) {
                            this.searchQuery = newQuery;
                        }
                    }
                } else {
                    this.searchQuery = '';
                }
            }
        }
    },

    methods: {
        getOptionLabel(option) {
            if (typeof option === 'string' || typeof option === 'number') {
                return String(option);
            }
            return option[this.optionLabel] || '';
        },

        getOptionValue(option) {
            if (typeof option === 'string' || typeof option === 'number') {
                return option;
            }
            return option[this.optionValue];
        },

        isSelected(option) {
            if (!this.modelValue) return false;
            return this.getOptionValue(option) === this.getOptionValue(this.modelValue);
        },

        onInput() {
            this.isOpen = true;
            this.highlightedIndex = -1;

            // If custom values are allowed, update the model value as user types
            if (this.allowCustomValue) {
                this.$emit('update:modelValue', this.searchQuery);
            }
        },

        onFocus() {
            this.isOpen = true;
        },

        onBlur() {
            setTimeout(() => {
                this.isOpen = false;

                // If custom values are allowed, emit the current search query as the value
                if (this.allowCustomValue && this.searchQuery && !this.modelValue) {
                    this.$emit('update:modelValue', this.searchQuery);
                    this.$emit('change', this.searchQuery);
                } else if (!this.modelValue) {
                    this.searchQuery = '';
                }
            }, 200);
        },

        toggleDropdown() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.$refs.input.focus();
            }
        },

        selectOption(option) {
            this.$emit('update:modelValue', option);
            this.$emit('change', option);
            this.searchQuery = this.getOptionLabel(option);
            this.isOpen = false;
            this.highlightedIndex = -1;
        },

        onKeyDown(e) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (!this.isOpen) {
                        this.isOpen = true;
                    } else if (this.highlightedIndex < this.filteredOptions.length - 1) {
                        this.highlightedIndex++;
                        this.scrollToHighlighted();
                    }
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    if (this.highlightedIndex > 0) {
                        this.highlightedIndex--;
                        this.scrollToHighlighted();
                    }
                    break;

                case 'Enter':
                    e.preventDefault();
                    if (this.isOpen && this.highlightedIndex >= 0) {
                        this.selectOption(this.filteredOptions[this.highlightedIndex]);
                    } else if (this.allowCustomValue && this.searchQuery) {
                        // Allow Enter to submit custom value
                        this.$emit('update:modelValue', this.searchQuery);
                        this.$emit('change', this.searchQuery);
                        this.isOpen = false;
                    }
                    break;

                case 'Escape':
                    e.preventDefault();
                    this.isOpen = false;
                    break;
            }
        },

        scrollToHighlighted() {
            this.$nextTick(() => {
                const listbox = this.$refs.listbox;
                if (!listbox) return;

                const highlighted = listbox.children[this.highlightedIndex];
                if (highlighted) {
                    highlighted.scrollIntoView({ block: 'nearest' });
                }
            });
        }
    }
};
</script>

<style scoped>
ul[role="listbox"]::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}
ul[role="listbox"]::-webkit-scrollbar-track {
    background: oklch(37% 0.013 285.805);
}
ul[role="listbox"]::-webkit-scrollbar-thumb {
    background: oklch(44.2% 0.017 285.786);
    border-radius: 24px;
}
</style>