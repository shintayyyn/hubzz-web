<template>
  <div class="file-modal bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b bg-gray-50 flex-shrink-0">
      <div class="flex items-center gap-3 min-w-0">
        <div class="file-icon flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" :class="iconBg">
          <svgicon :name="fileIcon" height="18" width="18" class="fill-current text-white" />
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-gray-800 text-sm truncate">
            {{ filename }}
          </p>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ fileTypeLabel }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0 ml-4">
        <a
          v-if="file.file && file.file.url"
          :href="file.file.url"
          :download="filename"
          target="_blank"
          class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svgicon name="cloud-download" height="14" width="14" />
          Download
        </a>
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          @click="$emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Preview area -->
    <div class="preview-area flex-1 relative bg-gray-100">
      <!-- Loading -->
      <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-100 z-10">
        <div class="spinner" />
        <p class="text-sm text-gray-500">
          Loading preview...
        </p>
      </div>

      <!-- Image -->
      <img
        v-if="file.file && file.file.type === 'image'"
        :src="fileUrl"
        class="w-full h-full object-contain p-4"
        @load="loading = false"
        @error="loading = false"
      >

      <!-- PDF: rendered client-side via pdf.js, no iframe/native-viewer dependency -->
      <div v-else-if="isPdf && !pdfError" ref="pdfContainer" class="pdf-viewer w-full h-full overflow-auto" />

      <div v-else-if="isPdf && pdfError" class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-gray-500 p-4 text-center">
        <p>Couldn't preview this PDF.</p>
        <a v-if="file.file && file.file.url" :href="file.file.url" target="_blank" class="text-blue-600 underline">Open it directly instead</a>
      </div>

      <!-- Other documents (Word, etc.) -->
      <iframe
        v-else-if="file.file"
        :src="fileUrl"
        class="w-full h-full border-0"
        @load="loading = false"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      loading: true,
      isIOS: false
    };
  },
  computed: {
    filename() {
      return (this.file && this.file.file && this.file.file.filename) ||
        (this.file && this.file.details && this.file.details.name) ||
        'File';
    },
    isPdf() {
      return !!(this.file && this.file.file && this.file.file.subtype === 'pdf');
    },
    fileUrl() {
      if (!this.file || !this.file.file) return '';
      return this.getFileUrl(this.file.file);
    },
    fileTypeLabel() {
      if (!this.file || !this.file.file) return '';
      const { subtype } = this.file.file;
      if (!subtype) return 'File';
      if (subtype === 'pdf') return 'PDF Document';
      if (subtype === 'jpeg' || subtype === 'png' || subtype === 'gif') return 'Image';
      if (subtype.includes('word') || subtype === 'msword') return 'Word Document';
      return subtype.split('.').pop().toUpperCase();
    },
    fileIcon() {
      if (!this.file || !this.file.file) return 'cloud-download';
      const { type, subtype } = this.file.file;
      if (type === 'image') return 'eye';
      if (subtype === 'pdf') return 'eye';
      return 'cloud-download';
    },
    iconBg() {
      if (!this.file || !this.file.file) return 'bg-gray-400';
      const { type, subtype } = this.file.file;
      if (type === 'image') return 'bg-purple-500';
      if (subtype === 'pdf') return 'bg-red-500';
      if (subtype && (subtype.includes('word') || subtype === 'msword')) return 'bg-blue-500';
      return 'bg-gray-500';
    }
  },
  watch: {
    file: {
      immediate: true,
      handler() {
        this.loading = true;
        this.pdfError = false;
        if (this.isPdf) {
          this.$nextTick(() => this.renderPdf());
        }
      }
    }
  },
  mounted() {
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },
  methods: {
    getFileUrl(file) {
      const { url, type, subtype } = file;
      if (type === 'application') {
        const isWordDoc =
          subtype === 'docx' ||
          subtype === 'doc' ||
          subtype === 'msword' ||
          subtype === 'doc' ||
          subtype === 'docx' ||
          subtype === 'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          subtype === 'vnd.openxmlformats-officedocument.wordprocessingml.template' ||
          subtype === 'vnd.ms-word.document.macroEnabled.12' ||
          subtype === 'vnd.ms-word.template.macroEnabled.12';

        if (subtype === 'pdf') {
          // iOS Safari renders PDF natively in iframe; Google Docs Viewer is blocked there
          if (this.isIOS) return url;
          return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        }

        if (isWordDoc) {
          // Microsoft Office Online Viewer has better iOS Safari iframe support than Google Docs Viewer
          if (this.isIOS) return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
          return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        }

        return url;
      }
      if (type === 'image') {
        if (subtype === 'tiff') {
          return `${process.env.API_URL}/image-to-jpeg?url=${url}`;
        }
        return url;
      }
      return url;
    },

    async renderPdf() {
      const container = this.$refs.pdfContainer;
      if (!container || !this.file || !this.file.file) return;

      try {
        const axios = require('axios');
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const { data } = await axios.get(this.file.file.url, {
          responseType: 'arraybuffer'
        });

        const pdf = await pdfjsLib.getDocument({ data }).promise;

        container.innerHTML = '';
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement('canvas');
          canvas.className = 'pdf-page';
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          container.appendChild(canvas);

          await page.render({
            canvasContext: canvas.getContext('2d'),
            viewport
          }).promise;
        }

        this.loading = false;
      } catch (err) {
        console.error('Failed to render PDF', err);
        this.pdfError = true;
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.file-modal {
  width: 90vw;
  max-width: 900px;
  height: 88vh;
  max-height: 88vh;
}

.preview-area {
  min-height: 0;
}

.pdf-viewer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.pdf-viewer >>> .pdf-page {
  max-width: 100%;
  height: auto;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #6b7280;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
