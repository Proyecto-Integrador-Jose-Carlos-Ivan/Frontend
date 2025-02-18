<template>
  <div class="pdf-popup">
    <div class="popup-header">
      <h2>Informe de Emergencias</h2>
      <button @click="close" class="close-btn">&times;</button>
    </div>
    <div class="pdf-content">
      <vue-pdf-embed :source="pdfUrl" :page="1" />
    </div>
    <div class="popup-footer">
      <button @click="downloadPdf" class="download-btn">Descargar PDF</button>
    </div>
  </div>
</template>

<script>
import vuePdfEmbed from 'vue-pdf-embed';

export default {
  components: {
    vuePdfEmbed,
  },
  props: {
    pdfUrl: {
      type: String,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    downloadPdf() {
      const link = document.createElement('a');
      link.href = this.pdfUrl;
      link.download = 'informe_emergencias.pdf';
      link.click();
    },
  },
};
</script>

<style scoped>
.pdf-popup {
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
}

.close-btn {
  padding: 5px 10px;
  background-color: #ddd;
  border: none;
  cursor: pointer;
}

.pdf-content {
  flex-grow: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* Make the embedded PDF occupy full space */
.pdf-content ::v-deep .vue-pdf-embed {
  width: 800px;
  height: 500px;
}

.popup-footer {
  padding: 10px;
  text-align: right;
}

.download-btn {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
