import { cache } from "../state/cache.js";

export function handleEnterKeyEvent() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const activeItem = results.querySelector(".checked");

      if (activeItem) {
        activeItem.click();
      }
    }
  });
}

export function handleKeyDownEvent() {
  document.addEventListener("keydown", (evt) => {
    console.log(cache.keyEventIndex);
    if (results.style.display === "flex") {
      if (evt.key === "ArrowUp") {
        Array.from(results.children).forEach((div) => {
          if (div.classList.contains("checked")) {
            div.classList.remove("checked");
          }
        });
        if (cache.keyEventIndex > 0) {
          cache.keyEventIndex--;
          results.children[cache.keyEventIndex].classList += " checked";
        } else {
          results.children[cache.keyEventIndex].classList += " checked";
        }
      }

      if (evt.key === "ArrowDown") {
        evt.preventDefault();
        Array.from(results.children).forEach((div) => {
          if (div.classList.contains("checked")) {
            div.classList.remove("checked");
          }
        });
        if (cache.keyEventIndex < results.children.length - 1) {
          cache.keyEventIndex++;
          results.children[cache.keyEventIndex].classList += " checked";
        } else {
          results.children[cache.keyEventIndex].classList += " checked";
        }
      }
    }
  });
}