<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import Quill from 'quill';

interface Props {
  modelValue: string;
  label?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const editor = ref<HTMLDivElement | null>(null);
let quill: Quill | null = null;

onMounted(() => {
  quill = new Quill(editor.value as HTMLDivElement, {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: [1, 2, 3, false] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'blockquote'],
      ],
    },
  });

  const editorEl = quill.root as HTMLElement;
  editorEl.style.color = '#000';
  editorEl.style.backgroundColor = '#fff';

  if (props.modelValue) {
    editorEl.innerHTML = props.modelValue;
  }

  quill.on('text-change', () => {
    const html = quill!.root.innerHTML;
    emit('update:modelValue', html);
  });
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (quill && quill.root.innerHTML !== newValue) {
      quill.root.innerHTML = newValue || '';
    }
  }
);
</script>

<template>
  <v-card flat class="pa-4">
    <v-card-title class="text-h6">{{ label }}</v-card-title>
    <v-divider class="mb-3" />

    <div ref="editor" class="quill-editor"></div>
  </v-card>
</template>

<style scoped>
.quill-editor {
  min-height: 300px;
  background-color: #fff;
  border-radius: 8px;
}

/* 🪄 Use :deep() to style Quill internals */
:deep(.ql-toolbar) {
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #ccc;
}

:deep(.ql-toolbar button) {
  color: #000 !important;
}

:deep(.ql-toolbar .ql-stroke) {
  stroke: #000 !important;
}

:deep(.ql-toolbar .ql-fill) {
  fill: #000 !important;
}

:deep(.ql-editor) {
  color: #000;
  background-color: #fff;
}

:deep(.ql-editor a) {
  color: #000 !important;
  text-decoration: underline;
}

:deep(.ql-tooltip) {
  background: #fff !important;
  color: #000 !important;
  border: 1px solid #ccc !important;
}

:deep(.ql-tooltip input[type='text']) {
  background: #fff !important;
  color: #000 !important;
  border: 1px solid #ccc !important;
}

:deep(.v-theme--dark .ql-toolbar) {
  background-color: #2c2c2c !important;
}

:deep(.v-theme--dark .ql-toolbar .ql-stroke),
:deep(.v-theme--dark .ql-toolbar .ql-fill) {
  stroke: #fff !important;
  fill: #fff !important;
}

:deep(.v-theme--dark .ql-editor) {
  background-color: #121212 !important;
  color: #fff !important;
}

:deep(.v-theme--dark .ql-editor a) {
  color: #90caf9 !important;
}
</style>
