export const ROUTES = {
  HOME: '/',
  ONBOARDING: '/onboarding',
  PLAY: '/play',
  LEADERBOARD: '/leaderboard',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
