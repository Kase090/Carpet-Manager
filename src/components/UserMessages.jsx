const messageTemplates = {
  // messages types:
  rowAdded: (label = "Row") => `"${label}" has been added to the table.`,
  rowDeleted: (label = "Row") => `"${label}" has been deleted from the table.`,
  columnAdded: (label = "Column") => `Column "${label}" has been added.`,
  columnDeleted: (label = "Column") => `Column "${label}" has been removed.`,
  rowEdited: (label = "Row") =>
    `Changes to "${label}" were saved successfully.`,
};

export function getUserMessage({ type, label }) {
  // find matching template
  const template = messageTemplates[type];
  // boundary case - if it doesn't return nothing
  if (!template) {
    return "";
  }

  return template(label);
}
