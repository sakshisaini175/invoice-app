const STORAGE_KEY = "invoice-studio-next-number";

const $ = (selector) => document.querySelector(selector);
const fields = {
  businessName: $("#business-name"), businessEmail: $("#business-email"),
  businessPhone: $("#business-phone"), clientName: $("#client-name"), clientAddress: $("#client-address"),
  invoiceNumber: $("#invoice-number"), invoiceDate: $("#invoice-date"), paymentTerms: $("#payment-terms"),
  itemDescription: $("#item-description"), quantity: $("#item-quantity"), rate: $("#item-rate")
};

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
  document.querySelectorAll(selector).forEach((element) => { element.textContent = value; });
}

function renderPreview() {
  const quantity = Math.max(0, Number.parseFloat(fields.quantity.value) || 0);
  const rate = Math.max(0, Number.parseFloat(fields.rate.value) || 0);
  const total = quantity * rate;
  setText(".preview-business-name", fields.businessName.value || "Your business name");
  setText(".preview-business-email", fields.businessEmail.value || "email@example.com");
  setText(".preview-business-phone", fields.businessPhone.value || "Phone number");
  setText(".preview-client-name", fields.clientName.value || "Client name");
  setText(".preview-client-address", fields.clientAddress.value || "Client address");
  setText(".preview-item-description", fields.itemDescription.value || "Line item");
  setText(".preview-quantity", String(quantity));
  setText(".preview-rate", formatMoney(rate));
  setText(".preview-amount", formatMoney(total));
  setText(".preview-subtotal", formatMoney(total));
  setText(".preview-total", formatMoney(total));
  setText(".preview-date", formatDate(fields.invoiceDate.value));
  setText(".preview-terms", fields.paymentTerms.value || "Due on receipt");
  setText(".invoice-number-display", fields.invoiceNumber.value);
}

function prepareInvoice() {
  const number = nextInvoiceNumber();
  fields.invoiceNumber.value = String(number).padStart(3, "0");
  fields.invoiceDate.value = new Date().toISOString().slice(0, 10);
  renderPreview();
}

Object.values(fields).forEach((field) => field.addEventListener("input", renderPreview));

$("#new-invoice").addEventListener("click", () => {
  prepareInvoice();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("#download-pdf").addEventListener("click", () => {
  renderPreview();
  localStorage.setItem(STORAGE_KEY, String(nextInvoiceNumber() + 1));
  document.title = `Invoice-${fields.invoiceNumber.value}`;
  window.print();
});

prepareInvoice();