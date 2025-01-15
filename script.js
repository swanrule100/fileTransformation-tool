document.getElementById("convertBtn").addEventListener("click", function () {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file to convert.");
    return;
  }

  const fileType = file.type;

  if (fileType === "image/jpeg" || fileType === "image/png") {
    convertImageToPDF(file);
  } else if (fileType === "application/pdf") {
    convertPDFToImage(file);
  } else if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    convertDocxToPDF(file);
  } else {
    alert("Unsupported file type.");
  }
});

function convertImageToPDF(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const imgData = event.target.result;
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.addImage(imgData, "JPEG", 0, 0);
    const pdfOutput = pdf.output("blob");
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = URL.createObjectURL(pdfOutput);
    downloadLink.download = "converted.pdf";
    downloadLink.style.display = "block";
    downloadLink.innerText = "Download PDF";
  };
  reader.readAsDataURL(file);
}

function convertPDFToImage(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const pdfData = new Uint8Array(event.target.result);
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    loadingTask.promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        const scale = 2;
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        page.render(renderContext).promise.then(() => {
          const imgData = canvas.toDataURL("image/png");
          const downloadLink = document.getElementById("downloadLink");
          downloadLink.href = imgData;
          downloadLink.download = "converted.png";
          downloadLink.style.display = "block";
          downloadLink.innerText = "Download Image";
        });
      });
    });
  };
  reader.readAsArrayBuffer(file);
}

function convertDocxToPDF(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const arrayBuffer = event.target.result;
    const doc = new window.docx.Document();

    // Here you would parse the DOCX file and add content to the doc object.
    // For simplicity, we will just create a simple PDF with a placeholder text.
    doc.addSection({
      children: [
        new window.docx.Paragraph({
          text: "This is a placeholder for the DOCX to PDF conversion.",
          heading: window.docx.HeadingLevel.HEADING_1,
        }),
      ],
    });

    window.PizZipUtils.getBinaryContent(file, function (error, content) {
      if (error) {
        throw error;
      }
      const pdf = new window.jspdf.jsPDF();
      pdf.text("Converted DOCX to PDF", 10, 10);
      const pdfOutput = pdf.output("blob");
      const downloadLink = document.getElementById("downloadLink");
      downloadLink.href = URL.createObjectURL(pdfOutput);
      downloadLink.download = "converted.pdf";
      downloadLink.style.display = "block";
      downloadLink.innerText = "Download PDF";
    });
  };
  reader.readAsArrayBuffer(file);
}
