function fixViewport(type = 'fixed', designWidth = 750, emMode = false) {
  let metaEl = document.querySelector('meta[name="viewport"]');
  //由于初始设置了viewport的width=device-width,所以此处docEl.clientWidth即是屏幕的设备宽度
  let clientWidth = document.documentElement.clientWidth;
  let width, scale;

  switch (type) {
    case 'fixed':
      width = designWidth;
      scale = clientWidth / designWidth;
      break;
    case 'rem':
      let dpr = window.devicePixelRatio || 1;
      width = clientWidth * dpr;
      scale = 1 / dpr;
      document.documentElement.style.fontSize = `${100 * (clientWidth * dpr / designWidth)}px`;
      break;
  }
  metaEl.setAttribute('content', `width=${width},initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale},viewport-fit=cover`);

  //em模式，设置body的基准字体大小
  emMode && window.addEventListener('DOMContentLoaded', function () {
    document.body.style.fontSize = `${50 / scale}px`;
  });
}

export {
  fixViewport
}