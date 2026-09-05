const STORAGE_KEY = "invoice-studio-next-number";

function initInvoiceApp() {
  const $ = (selector) => document.querySelector(selector);
  const businessName = $("#business-name");
  const businessPhone = $("#business-phone");
  const clientName = $("#client-name");
  const clientAddress = $("#client-address");
  const invoiceNumber = $("#invoice-number");
  const invoiceDate = $("#invoice-date");
  const lineItemsContainer = $("#line-items-container");
  const addLineButton = $("#add-line-item");
  const newInvoiceButton = $("#new-invoice");
  const downloadPdfButton = $("#download-pdf");
  const previewBody = $(".preview-line-items-body");

  if (!invoiceNumber || !invoiceDate || !lineItemsContainer || !addLineButton || !newInvoiceButton || !downloadPdfButton || !previewBody) {
    return;
  }

  function nextInvoiceNumber() {
    const saved = Number.parseInt(localStorage.getItem(STORAGE_KEY) || "1", 10);
    return Number.isFinite(saved) && saved > 0 ? saved : 1;
  }

  function formatMoney(value) {
    return `$${value.toFixed(2)}`;
  }

  function formatDate(value) {
    if (!value) return "—";
    return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T00:00:00`));
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  }

  function createLineItemRow({ description = "", quantity = 1, rate = 0 } = {}) {
    const row = document.createElement("div");
    row.className = "line-item-row";

    const header = document.createElement("div");
    header.className = "line-item-header";

    const label = document.createElement("span");
    label.className = "line-item-label";
    label.textContent = "Item";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-line-item";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", "Remove line item");
    removeButton.addEventListener("click", () => {
      const rows = lineItemsContainer.querySelectorAll(".line-item-row");
      if (rows.length > 1) {
        row.remove();
        renderPreview();
      }
    });

    header.append(label, removeButton);

    const descriptionField = document.createElement("input");
    descriptionField.type = "text";
    descriptionField.className = "line-item-description";
    descriptionField.value = description;
    descriptionField.placeholder = "What are you billing for?";

    const quantityField = document.createElement("input");
    quantityField.type = "number";
    quantityField.className = "line-item-quantity";
    quantityField.min = "0";
    quantityField.step = "1";
    quantityField.value = String(quantity);

    const rateField = document.createElement("input");
    rateField.type = "number";
    rateField.className = "line-item-rate";
    rateField.min = "0";
    rateField.step = "0.01";
    rateField.value = String(rate);

    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description";
    descriptionLabel.appendChild(descriptionField);

    const itemFields = document.createElement("div");
    itemFields.className = "two-col item-fields";

    const qtyLabel = document.createElement("label");
    qtyLabel.textContent = "Quantity";
    qtyLabel.appendChild(quantityField);

    const rateLabel = document.createElement("label");
    rateLabel.textContent = "Rate ($)";
    rateLabel.appendChild(rateField);

    itemFields.append(qtyLabel, rateLabel);
    row.append(header, descriptionLabel, itemFields);
    return row;
  }

  function resetLineItems() {
    lineItemsContainer.innerHTML = "";
    lineItemsContainer.appendChild(createLineItemRow({
      description: "Air conditioning installation",
      quantity: 1,
      rate: 9200
    }));
  }

  function getLineItems() {
    return Array.from(lineItemsContainer.querySelectorAll(".line-item-row")).map((row) => {
      const descriptionInput = row.querySelector(".line-item-description");
      const quantityInput = row.querySelector(".line-item-quantity");
      const rateInput = row.querySelector(".line-item-rate");

      const description = descriptionInput ? descriptionInput.value.trim() : "";
      const quantity = Math.max(0, Number.parseFloat(quantityInput?.value) || 0);
      const rate = Math.max(0, Number.parseFloat(rateInput?.value) || 0);

      return { description, quantity, rate };
    }).filter((item) => item.description || item.quantity > 0 || item.rate > 0);
  }

  function renderPreview() {
    const lineItems = getLineItems();
    const total = lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

    setText(".preview-business-name", businessName?.value || "Your business name");
    setText(".preview-business-phone", businessPhone?.value || "Phone number");
    setText(".preview-client-name", clientName?.value || "Client name");
    setText(".preview-client-address", clientAddress?.value || "Client address");
    setText(".preview-date", formatDate(invoiceDate.value));
    setText(".invoice-number-display", invoiceNumber.value || "001");

    const rows = lineItems.length
      ? lineItems.map((item) => `<tr><td>${item.description || "Line item"}</td><td class="align-right">${formatMoney(item.quantity * item.rate)}</td></tr>`).join("")
      : `<tr><td>Line item</td><td class="align-right">$0.00</td></tr>`;

    previewBody.innerHTML = `${rows}<tr class="reference-total-row"><td><strong>TOTAL</strong></td><td class="align-right"><strong>Total due: <span class="preview-total">${formatMoney(total)}</span></strong></td></tr><tr class="reference-thanks-row"><td>Thank you for your business.</td><td></td></tr>`;
  }

  function prepareInvoice() {
    const number = nextInvoiceNumber();
    invoiceNumber.value = String(number).padStart(3, "0");
    invoiceDate.value = new Date().toISOString().slice(0, 10);
    resetLineItems();
    renderPreview();
  }

  [businessName, businessPhone, clientName, clientAddress, invoiceNumber, invoiceDate].forEach((field) => {
    if (field) field.addEventListener("input", renderPreview);
  });

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.matches(".line-item-description, .line-item-quantity, .line-item-rate")) {
      renderPreview();
    }
  });

  addLineButton.addEventListener("click", () => {
    lineItemsContainer.appendChild(createLineItemRow({ description: "", quantity: 1, rate: 0 }));
    renderPreview();
  });

  newInvoiceButton.addEventListener("click", () => {
    prepareInvoice();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  downloadPdfButton.addEventListener("click", () => {
    renderPreview();
    localStorage.setItem(STORAGE_KEY, String(nextInvoiceNumber() + 1));
    document.title = `Invoice-${invoiceNumber.value || "001"}`;

    const invoicePaper = document.querySelector("#invoice-paper");
    const jsPdf = window.jspdf?.jsPDF;

    if (!invoicePaper || !jsPdf || !window.html2canvas) {
      window.print();
      return;
    }

    const pdf = new jsPdf({ orientation: "portrait", unit: "mm", format: "a4" });
    pdf.html(invoicePaper, {
      x: 0,
      y: 0,
      width: 210,
      windowWidth: 794,
      autoPaging: "text",
      html2canvas: { scale: 1, useCORS: true },
      callback: (pdfDocument) => pdfDocument.save(`Invoice-${invoiceNumber.value || "001"}.pdf`)
    });
  });

  prepareInvoice();
}

document.addEventListener("DOMContentLoaded", initInvoiceApp);