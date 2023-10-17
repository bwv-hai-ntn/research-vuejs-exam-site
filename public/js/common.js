$(function () {
  hideLoading();
});

function hideLoading() {
  $('.loading').hide();
}

function showLoading() {
  $('.loading').show();
}

function setCookie(key, value, expiry) {
  var expires = new Date();
  expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
  document.cookie = key + '=' + value + ';path=/' + ';expires=' + expires.toUTCString();
}

function numberFormat(x) {
  try {
    if (x == null) {
        return '';
    }
    const amount = `${x}`;
    const parts = amount.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (parts[1] !== undefined) {
      parts[1] = parts[1].slice(0, 2);
    }
    return parts.join('.');
  } catch (_) {
    return '';
  }
}
getAnswerListUrl();
function getAnswerListUrl() {
  var urlAnswerView = document.referrer.replace(window.location.origin, '');
  var urlHistory = '';
  if (/^\/admin\/answer\/([0-9]+)$/.test(urlAnswerView)) {
    urlHistory = window.location.pathname;
  }
  var sessionHistory = sessionStorage.getItem('history');
  if (urlHistory) {
    sessionStorage.setItem('history', urlHistory); 
  }
}
