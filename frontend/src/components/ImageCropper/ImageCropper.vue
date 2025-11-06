<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps<{
  modelValue: string | null;
  label?: string;
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const image = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const dialog = ref(false);
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const cropped = ref<string | null>(props.modelValue || null);

watch(
  () => props.modelValue,
  (newVal) => {
    cropped.value = newVal;
  }
);

watch(cropped, (newVal) => {
  emit('update:modelValue', newVal);
});

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      image.value = event.target?.result as string;
      dialog.value = true;
    };
    reader.readAsDataURL(target.files[0]);
  }
};

const cropImage = () => {
  if (cropperRef.value) {
    const { canvas } = cropperRef.value.getResult() as { canvas: HTMLCanvasElement };
    const base64 = canvas.toDataURL('image/png');
    cropped.value = base64;

    const croppedFile = base64ToFile(base64, selectedFile.value?.name || 'cropped.png');
    emit('change', base64, croppedFile);
  }
  dialog.value = false;
};

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const selectNewImage = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="text-center my-4">
    <div v-if="label" class="mb-2 text-subtitle-1 font-weight-medium">{{ label }}</div>

    <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" style="display: none" />

    <v-img
      v-if="cropped"
      :src="cropped"
      width="140"
      height="140"
      rounded="circle"
      class="mx-auto cursor-pointer elevation-2"
      @click="selectNewImage"
    />

    <v-avatar v-else size="140" class="mx-auto cursor-pointer elevation-2" color="grey-lighten-3" @click="selectNewImage">
      <v-icon size="48">mdi-camera</v-icon>
    </v-avatar>

    <v-dialog v-model="dialog" max-width="700">
      <v-card>
        <v-card-title class="text-h6 font-weight-medium">Crop Image</v-card-title>
        <v-card-text>
          <div v-if="image" style="width: 100%; height: 500px">
            <Cropper
              ref="cropperRef"
              :src="image"
              :stencil-props="{ aspectRatio: 1 }"
              class="border rounded-md overflow-hidden"
              style="width: 100%; height: 100%"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="secondary" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="cropImage">Crop</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.border {
  border: 1px solid #ccc;
}
.rounded-md {
  border-radius: 8px;
}
</style>
