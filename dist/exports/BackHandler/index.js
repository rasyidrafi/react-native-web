var listeners = [];
var addEventListener = (event, listener) => {
  listeners.unshift(listener);
  return {
    remove: () => removeEventListener(event, listener)
  };
};
var removeEventListener = (_event, listener) => {
  listeners.splice(listeners.indexOf(listener), 1);
};
var back = window.history.back;
window.history.back = function () {
  var handled = listeners.find(l => l());
  if (!handled) {
    return back.apply(window.history, []);
  }
};
window.addEventListener('popstate', () => {
  var handled = listeners.find(l => l());
  if (!handled) {
    back.apply(window.history, []);
  }
  window.history.pushState(null, '', window.location.href);
});

// Hack for Chrome. See this issue: https://stackoverflow.com/questions/64001278/history-pushstate-on-chrome-is-being-ignored?noredirect=1#comment113174647_64001278
var onFirstPress = () => {
  window.history.pushState(null, '', window.location.href);
  window.removeEventListener('focusin', onFirstPress);
};
window.addEventListener('focusin', onFirstPress);

// Detect pressing back key on web browsers
window.addEventListener('popstate', e => {
  var handled = listeners.find(l => l());
  if (handled) e.preventDefault();
});
var exitApp = () => {
  listeners.length = 0;
  back.apply(window.history, []);
};
export default {
  addEventListener,
  exitApp,
  removeEventListener
};