let timeoutId;

async function startTimer(delay) {
  // If there is an existing timeout, clear it
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  // Set a new timeout
  return new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      timeoutId = null;
      resolve();
    }, delay);
  });
}

module.exports = {
  startTimer,
};
