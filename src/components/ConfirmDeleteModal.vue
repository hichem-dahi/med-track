<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card prepend-icon="mdi-delete-alert">
      <template v-slot:title> Attention </template>
      <template v-slot:text>
        <div>{{ $t('confirm-delete-msg') }}</div>
      </template>
      <template v-slot:prepend>
        <v-icon color="red-darken-3" size="x-large" />
      </template>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
          {{ $t('cancel') }}
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="emits('confirm')">
          {{ $t('confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const dialog = defineModel<boolean>()
const emits = defineEmits(['confirm'])
</script>
<style scoped>
.v-card {
  white-space: normal;
}
</style>
