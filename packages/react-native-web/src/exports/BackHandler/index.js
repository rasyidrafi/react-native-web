 /*
 * @flow
 */
const listeners: Array<() => boolean | null | undefined> = []
const addEventListener = (event: 'hardwareBackPress', listener: () => boolean | null | undefined) => {
  listeners.unshift(listener);
  return { remove: () => removeEventListener(event, listener) }
};

const removeEventListener = (_event: 'hardwareBackPress', listener: () => boolean | null | undefined) => {
  listeners.splice(listeners.indexOf(listener), 1);
};

const back = window.history.back
window.history.back = function () {
  const handled = listeners.find(l => l())
  if (!handled) {
    return back.apply(window.history, [])
  }
}

window.addEventListener('popstate', () => {
  const handled = listeners.find(l => l())
  if (!handled) {
    back.apply(window.history, [])
  }
  window.history.pushState(null, '', window.location.href)
})

// Hack for Chrome. See this issue: https://stackoverflow.com/questions/64001278/history-pushstate-on-chrome-is-being-ignored?noredirect=1#comment113174647_64001278
const onFirstPress = () => {
  window.history.pushState(null, '', window.location.href)
  window.removeEventListener('focusin', onFirstPress)
};
window.addEventListener('focusin', onFirstPress);

// Detect pressing back key on web browsers
window.addEventListener('popstate', (e) => {
  const handled = listeners.find(l => l());
  if (handled) e.preventDefault();
});

const exitApp = () => {
  listeners.length = 0;
  back.apply(window.history, [])
};

export default {
  addEventListener,
  exitApp,
  removeEventListener
};
