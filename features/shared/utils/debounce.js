export function debounce(func, delay, options = {}) {
  let timerId = null;

  return function (...args) {
    if (!timerId && options.leading) {
      func(...args);
    }
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => func(...args), delay);
  };
}
