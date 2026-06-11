<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  description?: string
  icon?: Component
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center py-16 px-4">
    <div v-if="icon" class="rounded-full bg-muted p-4 mb-4">
      <component :is="icon" :size="32" class="text-muted-foreground" />
    </div>
    <h3 class="text-base font-semibold text-foreground mb-1">{{ title }}</h3>
    <p v-if="description" class="text-sm text-muted-foreground mb-4 max-w-sm">
      {{ description }}
    </p>
    <slot />
  </div>
</template>
