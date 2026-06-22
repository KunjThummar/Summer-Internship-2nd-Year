export const useToast = () => {
  const showToast = (message, type = 'info') => {
    const event = new CustomEvent('show-toast', { detail: { message, type } });
    window.dispatchEvent(event);
  };

  return {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    info: (msg) => showToast(msg, 'info'),
  };
};
