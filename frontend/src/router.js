import { getSession } from "./session.js";
import { normalizeRole, getHomePath } from "./components/layout/navigation.js";

const routes = [];
let currentParams = {};
/**
 * 
 * @param {string} path 
 * @param {Function} renderFn 
 * @param {Object} options
 * @param {boolean} options.private   
 * @param {string[]} options.roles    
 * @param {boolean} options.guestOnly
 */
export function registerRoute(path, renderFn, options = {}) {
  routes.push({
    path,
    renderFn,
    paramNames: extractParamNames(path),
    pattern: toRegExp(path),
    private: Boolean(options.private || options.roles?.length),
    roles: options.roles ?? null,
    guestOnly: Boolean(options.guestOnly),
  });
}

function extractParamNames(path) {
  return (path.match(/:[^/]+/g) || []).map((token) => token.slice(1));
}

function toRegExp(path) {
  const pattern = path
    .replace(/[.+*?^${}()|[\]\\]/g, "\\$&") 
    .replace(/:[^/]+/g, "([^/]+)"); 
  return new RegExp(`^${pattern}$`);
}

function matchRoute(path) {
  for (const route of routes) {
    const match = path.match(route.pattern);
    if (!match) continue;

    const params = {};
    route.paramNames.forEach((name, index) => {
      params[name] = decodeURIComponent(match[index + 1]);
    });

    return { route, params };
  }
  return null;
}

export function navigate(path) {
  if (window.location.pathname === path) {
    render();
  } else {
    window.history.pushState(null, "", path);
    render();
  }
}

export function getParams() {
  return currentParams;
}

function currentPath() {
  return window.location.pathname || "/";
}
function resolveAccess(route, session) {
  if (route.guestOnly && session) {
    return getHomePath(session.rol);
  }

  if (route.private && !session) {
    return "/login";
  }

  if (route.roles && session) {
    const allowed = route.roles.map(normalizeRole);
    if (!allowed.includes(normalizeRole(session.rol))) {
      return getHomePath(session.rol);
    }
  }

  return null;
}
async function render() {
  const path = currentPath();
  const session = getSession();

  const matched = matchRoute(path);

  if (!matched) {
    return renderNotFound();
  }

  const redirectTo = resolveAccess(matched.route, session);

  if (redirectTo) {
    return navigate(redirectTo);
  }

  currentParams = matched.params;

  await mount(matched.route.renderFn);
}

async function renderNotFound() {
  const notFound = routes.find((route) => route.path === "/404");
  if (!notFound) return;

  currentParams = {};
  await mount(notFound.renderFn);
}

async function mount(renderFn) {
  const app = document.getElementById("app");

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  const view = await renderFn();

  app.innerHTML = "";
  app.appendChild(view);
}
export function startRouter() {
 
  window.addEventListener("popstate", render);
  window.addEventListener("DOMContentLoaded", render);
  if (document.readyState !== "loading") render();
}
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");
  if (!link) return;

  const isModifiedClick =
    e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

  if (isModifiedClick || link.target === "_blank") return;

  e.preventDefault();
  navigate(link.getAttribute("href"));
});
