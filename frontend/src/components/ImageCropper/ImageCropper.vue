<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps<{
  modelValue: string | null;
}>();

const emit = defineEmits(['update:modelValue']);

const image = ref<string | null>(null);
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
    cropped.value = canvas.toDataURL('image/png');
  }
  dialog.value = false;
};

const selectNewImage = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="text-center my-4">
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
