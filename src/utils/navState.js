export function saveNavState(universeId, tabIndex, scrollY) { 
  if (typeof window === 'undefined') return;
  localStorage.setItem(`nav_${universeId}`, JSON.stringify({tabIndex, scrollY})); 
}
export function loadNavState(universeId) { 
  if (typeof window === 'undefined') return null;
  const key = `nav_${universeId}`;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}