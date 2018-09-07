<template>
  <div>
    <span>{{ item.classify }}</span>
  </div>
</template>

<script>
export default {
  props: {
    item: { required: true }
  }
}
</script>