import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

// NOTE: per-route <head> / SEO metadata is intentionally left to the SEO pass.
// Baseline title + description live in index.html; richer head management can be
// layered on here via the route `head` option + <HeadContent />.
export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
