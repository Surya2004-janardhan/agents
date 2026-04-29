import { Router, Request, Response } from 'express';
import passport from '../lib/passport';
import { createSession, rotateSession, deleteSession } from '../lib/jwt';
import { authenticate, AuthRequest } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ─── Google OAuth ─────────────────────────────────────────────
router.get(
  '/google',
  authLimiter,
  passport.authenticate('google', { scope: ['profile', 'email'], session: false }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/auth/login?error=oauth` }),
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const { accessToken, refreshToken } = await createSession(user.id, user.email);
    res
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
    res.redirect(`${FRONTEND_URL}/dashboard`);
  },
);

// ─── GitHub OAuth ─────────────────────────────────────────────
router.get(
  '/github',
  authLimiter,
  passport.authenticate('github', { scope: ['user:email'], session: false }),
);

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/auth/login?error=oauth` }),
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const { accessToken, refreshToken } = await createSession(user.id, user.email);
    res
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
    res.redirect(`${FRONTEND_URL}/dashboard`);
  },
);

// ─── Refresh Token ────────────────────────────────────────────
router.post('/refresh', async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token as string | undefined;
  if (!token) {
    res.status(401).json({ error: 'No refresh token' });
    return;
  }
  try {
    const { accessToken, refreshToken } = await rotateSession(token);
    res
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
    res.json({ accessToken });
  } catch {
    res.clearCookie('refresh_token').clearCookie('access_token');
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// ─── Logout ───────────────────────────────────────────────────
router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  const token = req.cookies?.refresh_token as string | undefined;
  if (token) await deleteSession(token);
  res
    .clearCookie('refresh_token')
    .clearCookie('access_token')
    .json({ message: 'Logged out' });
});

// ─── Me ───────────────────────────────────────────────────────
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const { prisma } = await import('../lib/prisma');
  const user = await prisma.user.findUnique({
    where: { id: req.user!.sub },
    select: { id: true, email: true, name: true, avatar: true, bio: true, provider: true, createdAt: true },
  });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
});

export default router;
