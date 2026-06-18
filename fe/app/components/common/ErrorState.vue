<script setup lang="ts">
import { PhWarningCircle, PhArrowClockwise } from '@phosphor-icons/vue'
import { Button } from '@/components/ui/button'

defineProps<{
  message: string
  onRetry?: () => void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center py-16 px-4">
    <div class="rounded-full bg-destructive/10 p-4 mb-4">
      <PhWarningCircle :size="32" class="text-destructive" />
    </div>
    <h3 class="text-base font-semibold text-foreground mb-1">Something went wrong</h3>
    <p class="text-sm text-muted-foreground mb-4 max-w-sm">{{ message }}</p>
    <Button v-if="onRetry" size="sm" variant="outline" @click="onRetry">
      <PhArrowClockwise :size="16" />
      Try again
    </Button>
  </div>
</template>
