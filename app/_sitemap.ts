export default function sitemap() {
  return [
    { path: '/' },
    { path: '/login' },
    { path: '/register' },
    { path: '/(user)' },
    { path: '/(user)/pedir' },
    { path: '/(user)/modificar' },
    { path: '/(user)/rastrear' },
    { path: '/(driver)' },
    { path: '/(driver)/asignados' },
    { path: '/(driver)/gps' },
    { path: '/(tabs)' },
    { path: '/(tabs)/index' },
    { path: '/(tabs)/explore' },
    { path: '/(tabs)/pedidos' },
    { path: '/pedidos/[id]' },
    { path: '/modal' },
  ];
}
