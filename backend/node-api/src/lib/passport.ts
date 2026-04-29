import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { prisma } from '../lib/prisma';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

// Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${BASE_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || '';
        const user = await prisma.user.upsert({
          where: { provider_providerId: { provider: 'google', providerId: profile.id } },
          update: {
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
          },
          create: {
            email,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
            provider: 'google',
            providerId: profile.id,
          },
        });
        done(null, user);
      } catch (err) {
        done(err as Error);
      }
    },
  ),
);

// GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: `${BASE_URL}/api/auth/github/callback`,
      scope: ['user:email'],
    },
    async (_accessToken: string, _refreshToken: string, profile: any, done: (err: any, user?: any) => void) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github.noreply`;
        const user = await prisma.user.upsert({
          where: { provider_providerId: { provider: 'github', providerId: String(profile.id) } },
          update: {
            name: profile.displayName || profile.username,
            avatar: profile.photos?.[0]?.value,
          },
          create: {
            email,
            name: profile.displayName || profile.username,
            avatar: profile.photos?.[0]?.value,
            provider: 'github',
            providerId: String(profile.id),
          },
        });
        done(null, user);
      } catch (err) {
        done(err as Error);
      }
    },
  ),
);

export default passport;
