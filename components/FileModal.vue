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
      <div v-if="loading && !(isIOS && isPDF)" class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-100 z-10">
        <div class="spinner" />
        <p class="text-sm text-gray-500">
          Loading preview...
        </p>
      </div>

      <!-- iOS PDF: open in Safari for native full-page viewer -->
      <div
        v-if="isIOS && isPDF"
        class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-50 px-6 text-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <p class="text-sm text-gray-500">
          PDF preview is not available inline on iOS.
        </p>
        <a
          :href="file.file.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Open PDF
        </a>
      </div>

      <!-- Image -->
      <img
        v-else-if="file.file && file.file.type === 'image'"
        :src="fileUrl"
        class="w-full h-full object-contain p-4"
        @load="loading = false"
        @error="loading = false"
      >

      <!-- Document / iframe (Android + desktop) -->
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
      isIOS: false,
      isAndroid: false
    };
  },
  computed: {
    filename() {
      return (this.file && this.file.file && this.file.file.filename) ||
        (this.file && this.file.details && this.file.details.name) ||
        'File';
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
      if (type === 'image') return '';
      if (subtype === 'pdf') return '';
      return 'cloud-download';
    },

    iconBg() {
      if (!this.file || !this.file.file) return 'bg-gray-400';
      const { type, subtype } = this.file.file;
      if (type === 'image') return 'bg-purple-500';
      if (subtype === 'pdf') return 'bg-red-500';
      if (subtype && (subtype.includes('word') || subtype === 'msword')) return 'bg-blue-500';
      return 'bg-gray-500';
    },
    isPDF() {
      return this.file && this.file.file && this.file.file.subtype === 'pdf';
    }
  },
  watch: {
    file() {
      this.loading = true;
    }
  },
  mounted() {
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    this.isAndroid = /Android/.test(navigator.userAgent);
  },
  methods: {
    getFileUrl(file) {
      const { url, type, subtype } = file;
      if (type === 'application') {
        const isWordDoc =

          subtype === 'msword' ||
          subtype === 'doc' ||
          subtype === 'docx' ||
          subtype === 'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          subtype === 'vnd.openxmlformats-officedocument.wordprocessingml.template' ||
          subtype === 'vnd.ms-word.document.macroEnabled.12' ||
          subtype === 'vnd.ms-word.template.macroEnabled.12';

        if (subtype === 'pdf') {
          // Android Chrome can't render PDF natively in iframe — use Google Docs Viewer
          // iOS Safari and desktop browsers render PDF natively in iframe
          if (this.isAndroid) {
            return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
          }
          return url;
        }

        if (isWordDoc) {
          return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
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
