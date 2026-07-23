<template>
  <div class="scalar-api-container">
    <ApiReference
      v-if="mounted"
      :key="themeKey"
      :configuration="scalarConfig"
    />
    <div v-else class="loading" role="status" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true"></span>
      <p>Carregando a referência da Blue Credit API...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inBrowser, useData, withBase } from 'vitepress'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

const ApiReference = defineAsyncComponent({
  loader: () =>
    import('@scalar/api-reference').then((module) => module.ApiReference),
  timeout: 15_000
})

const props = withDefaults(
  defineProps<{
    specUrl?: string
  }>(),
  {
    specUrl: '/openapi.json'
  }
)

const { isDark } = useData()
const mounted = ref(false)
const themeKey = computed(() => (isDark.value ? 'dark' : 'light'))

const scalarConfig = computed(() => ({
  spec: {
    url: withBase(props.specUrl)
  },
  theme: isDark.value ? 'moon' : 'default',
  withDefaultFonts: false,
  hideDarkModeButton: true,
  layout: 'modern',
  showSidebar: true,
  searchHotKey: 'k',
  metaData: {
    title: 'Blue Credit API Reference',
    description: 'Contrato OpenAPI oficial da Blue Credit API'
  }
}))

onMounted(() => {
  if (inBrowser) mounted.value = true
})
</script>

<style scoped>
.scalar-api-container {
  min-height: calc(100vh - var(--vp-nav-height));
  width: 100%;
}

.loading {
  min-height: 70vh;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 1rem;
  color: var(--vp-c-text-2);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--vp-c-bg-mute);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<style>
.VPDoc:has(.scalar-api-container) {
  padding: 0 !important;
}

.VPDoc:has(.scalar-api-container) .container,
.VPDoc:has(.scalar-api-container) .content,
.VPDoc:has(.scalar-api-container) .content-container {
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>
