export function portal(node: HTMLElement) {
  document.body.appendChild(node);

  return {
    destroy() {
      node.remove();
    },
  };
}

export function closeOnEscape(node: HTMLElement, close: () => void) {
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  };

  document.addEventListener("keydown", onKeydown);

  return {
    update(nextClose: () => void) {
      close = nextClose;
    },
    destroy() {
      document.removeEventListener("keydown", onKeydown);
    },
  };
}
