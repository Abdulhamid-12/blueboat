<script setup>
import { useColorMode } from '@vueuse/core';

const mode = useColorMode();
</script>

<template>
    <UTooltip :text="mode === 'dark' ? 'Light Mode' : 'Dark Mode'" :delay-duration="0">
        <UButton
          :icon="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
          color="neutral"
          variant="ghost"
          class="cursor-pointer"
          @click="mode = mode === 'dark' ? 'light' : 'dark'"
        />
    </UTooltip>
</template>