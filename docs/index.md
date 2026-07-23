---
layout: page
sidebar: false
aside: false
head:
  - - meta
    - name: robots
      content: noindex,follow
---

<script setup>
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

onMounted(() => {
  window.location.replace(withBase('/pt/'))
})
</script>

Redirecionando para a [documentação em português](/pt/).
