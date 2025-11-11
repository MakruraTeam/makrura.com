<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import Quill from 'quill';

interface Props {
  modelValue: string;
  label?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'update:embeddedImages']);

const editor = ref<HTMLDivElement | null>(null);
let quill: Quill | null = null;

const embeddedImages = ref<File[]>([]);

onMounted(() => {
  quill = new Quill(editor.value as HTMLDivElement, {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ header: [1, 2, 3, false] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          ['link', 'blockquote', 'image'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    },
  });

  const editorEl = quill.root as HTMLElement;
  editorEl.style.color = '#000';
  editorEl.style.backgroundColor = '#fff';

  if (props.modelValue) {
    editorEl.innerHTML = props.modelValue;
  }

  quill.on('text-change', () => {
    emit('update:modelValue', quill!.root.innerHTML);
  });
});

function imageHandler(this: any) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const placeholderId = `image-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const range = quill!.getSelection(true);
      quill!.insertEmbed(range.index, 'image', base64);
      quill!.setSelection(range.index + 1);

      requestAnimationFrame(() => {
        const editorEl = quill!.root as HTMLElement;
        const imgs = editorEl.querySelectorAll('img[src^="data:"]');
        const lastImg = imgs[imgs.length - 1];
        if (lastImg) {
          lastImg.setAttribute('data-temp-id', placeholderId);

          emit('update:modelValue', editorEl.innerHTML);
        }
      });

      embeddedImages.value.push(Object.assign(file, { __placeholderId: placeholderId }));
      emit('update:embeddedImages', embeddedImages.value);
    };
    reader.readAsDataURL(file);
  };
}

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
</style>
