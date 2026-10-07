// utils/domUtils.js
import { hourlyDropdownButton, weekDaysContainer } from "../dom/domElements.js"; 
//Marca apenas um botão como selecionado dentro de um container.
export function setSingleSelection(div, button) {
  Array.from(div.children).forEach((child) => {
    if (child.classList.contains("checked")) {
      child.classList.remove("checked");
    }
  });

  button.classList = "checked";
}

//Alterna uma classe "rotated" em um botão e aplica estilos de dropdown.
export function toggleDropdown(button, container, expandedHeight, outlineStyle) {
  button.classList.toggle("rotated");

  if (button.classList.contains("rotated")) {
    button.style.transform = "rotate(180deg)";
    container.style.height = expandedHeight;
    container.style.outline = outlineStyle;
  } else {
    button.style.transform = "rotate(0deg)";
    container.style.height = "0";
    container.style.outline = "none";
  }
}

export function toggleHourlyDropdown() {
  hourlyDropdownButton.classList.toggle("rotated");

  if (hourlyDropdownButton.classList.contains("rotated")) {
    hourlyDropdownButton.style.transform = `rotate(180deg)`;
    weekDaysContainer.style.height = "29.5rem";
    weekDaysContainer.style.outline = "2px solid var(--Neutral-600)";
  } else {
    hourlyDropdownButton.style.transform = `rotate(0deg)`;
    weekDaysContainer.style.height = "0";
    weekDaysContainer.style.outline = "none";
  }
}

//Atualiza o texto de um elemento com valor formatado.
export function updateTextContent(element, value, suffix = "") {
  element.textContent = `${value}${suffix}`;
}