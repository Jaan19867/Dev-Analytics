/* eslint-disable no-restricted-globals */
/**
 *  Such functions are called automatically at the start of every page/session
    (function () {
    })();
 */
(function () {
  // If page is serverside rendered, the we return normally
  if (!document) {
    return;
  }

  // used to get values passed through the script tag. For eg.
  // <script src="my-script.js" data-hash="true"></script>
  const currentScript = document.currentScript;
  const host = 'https://backend.vedanalytics.in/api/';

  const generateUid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
  const projectId = currentScript.getAttribute('data-project');
  const apiKey = currentScript.getAttribute('data-api-key');

  let uid = generateUid();
  let hiddenStartTime = 0;
  let hiddenTotalTime = Date.now();
  let isUnloadCalled = false;

  const historyPush = history.pushState;
  const historyReplace = history.replaceState;

  // Called at the time of 'unload' the page. Sets the script to be ready for a new page
  const cleanup = () => {
    uid = generateUid();
    hiddenStartTime = 0;
    hiddenTotalTime = Date.now();
    isUnloadCalled = false;
  };

  const setItemWithTTL = (key, value, ttl) => {
    const item = {
      value,
      expiry: ttl ? Date.now() + ttl * 1000 : null,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getItemWithTTL = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);

      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (e) {
      localStorage.removeItem(key);
      return null;
    }
  };

  // We are wrapping history.pushState and history.replaceState by this function later.
  // This tracks the changes in the url of the tab
  const wrapHistoryFunc = (original) =>
    function (_state, _unused, url) {
      if (url && location.pathname !== new URL(url, location.href).pathname) {
        sendUnloadBeacon();
        cleanup();
        original.apply(this, arguments);
        sendLoadBeacon();
      } else {
        original.apply(this, arguments);
      }
    };

  // Pings the cache, sends req to /checkUniqueUser to know if user is unique or not.
  const pingCache = (projectId) => {
    const cachedData = getItemWithTTL(projectId);
    if (cachedData) {
      setItemWithTTL(projectId, Date.now(), 86400);
      return false;
    } else {
      setItemWithTTL(projectId, Date.now(), 86400);
      return true;
    }
  };

  // Function to call /newEvent
  const sendLoadBeacon = async () => {
    const isFirstVisit = pingCache(projectId);
    if (!sessionStorage.getItem('eventCalled')) {
      fetch(host + 'event/newEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          i: uid,
          r: document.referrer,
          v: isFirstVisit,
          p: location.href,
          k: false,
          u: projectId,
          t: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      sessionStorage.setItem('eventCalled', 'true');
    } else {
      fetch(host + 'event/newEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          i: uid,
          r: document.referrer,
          v: isFirstVisit,
          p: location.href,
          k: true,
          u: projectId,
          t: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
    }
  };

  // Function to call /endEvent
  const sendUnloadBeacon = () => {
    if (!isUnloadCalled) {
      navigator.sendBeacon(
        host + 'event/endEvent',
        JSON.stringify({
          i: uid,
          u: projectId,
          m: Date.now() - hiddenTotalTime,
        })
      );
    }
    isUnloadCalled = true;
  };

  if ('onpagehide' in self) {
    addEventListener('pagehide', sendUnloadBeacon, { capture: true });
  } else {
    addEventListener('beforeunload', sendUnloadBeacon, { capture: true });
    addEventListener('unload', sendUnloadBeacon, { capture: true });
  }

  addEventListener(
    'visibilitychange',
    () => {
      if (document.visibilityState === 'hidden') {
        hiddenStartTime = Date.now();
      } else {
        hiddenTotalTime += Date.now() - hiddenStartTime;
        hiddenStartTime = 0;
      }
    },
    { capture: true }
  );

  sendLoadBeacon();

  // Checks for hash changes in the URL.
  if (currentScript.getAttribute('data-hash')) {
    addEventListener('hashchange', sendLoadBeacon, {
      capture: true,
    });
  } else {
    history.pushState = wrapHistoryFunc(historyPush);
    history.replaceState = wrapHistoryFunc(historyReplace);
    addEventListener(
      'popstate',
      () => {
        sendUnloadBeacon();
        cleanup();
        sendLoadBeacon();
      },
      {
        capture: true,
      }
    );
  }
})();

/**
 * EVENT LISTENERS -
 * onpagehide -
 * pagehide -
 * beforeunload -
 * unload -
 * visibilitychange -
 */
