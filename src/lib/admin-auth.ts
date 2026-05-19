 export function verifyAdminPassword(input: string) {
  return input === "test123";
}

export function setAdminAuthenticated() {
  localStorage.setItem("ca_admin_auth", "true");
  localStorage.setItem("ca_admin_auth_ts", Date.now().toString());
}

export function isAdminAuthenticated() {
  const auth = localStorage.getItem("ca_admin_auth");
  const ts = localStorage.getItem("ca_admin_auth_ts");

  if (!auth || !ts) return false;

  const age = Date.now() - parseInt(ts, 10);
  const maxAge = 8 * 60 * 60 * 1000; // 8 hours

  if (age > maxAge) {
    clearAdminAuthenticated();
    return false;
  }

  return true;
}

export function clearAdminAuthenticated() {
  localStorage.removeItem("ca_admin_auth");
  localStorage.removeItem("ca_admin_auth_ts");
}
export function shouldShowAdminLink() {
  return false;
}
