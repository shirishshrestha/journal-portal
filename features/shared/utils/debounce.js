export function debounce(func, delay, options = {}) {
  let timerId = null;

  const debounced = function (...args) {
    if (!timerId && options.leading) {
      func(...args);
    }
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      func(...args);
      timerId = null;
    }, delay);
  };

  debounced.cancel = function () {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return debounced;
}
