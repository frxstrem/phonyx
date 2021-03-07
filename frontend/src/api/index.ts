export function getApiBaseUrl(): string {
  if ("apiBaseUrl" in window.sessionStorage) {
    return window.sessionStorage["apiBaseUrl"];
  } else if ("apiBaseUrl" in window.localStorage) {
    return window.localStorage["apiBaseUrl"];
  } else {
    return "/api";
  }
}
