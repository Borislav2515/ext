export function createElementBlock(tagName, className, text, atr='defaultValue') {
  const element = document.createElement(tagName);
  if (className) {
      element.classList.add(className);
  }

  if (text) {
      element.innerText = text;
  }

  return element;
}
export function createCheckbox(labelText, value) {
  const label = createElementBlock('label', 'checkbox');
  label.classList.add('style-e');
  const checkbox = createElementBlock('input', 'checkbox__checkbox');
  checkbox.type = 'checkbox';
  checkbox.value = labelText;

  const checkmarkDiv = createElementBlock('div', 'checkbox__checkmark');
  const bodyDiv = createElementBlock('div', 'checkbox__body', labelText);

  label.appendChild(checkbox);
  label.appendChild(checkmarkDiv);
  label.appendChild(bodyDiv);

  return label;
}
