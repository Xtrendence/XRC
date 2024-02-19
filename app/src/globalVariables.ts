export const apiUrl = `${window.location.protocol}//${
  window.location.hostname
}:${3040}`;

export const navigationHeight = 64;

export const pageHeight = `calc(100dvh - ${navigationHeight}px)`;

export const pageMargin = '16px';

export const contentHeight = `calc(100dvh - ${navigationHeight}px - ${pageMargin} * 2)`;

export const toastOptions = {
  style: {
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
  },
};
