import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { OAuthConfig } from 'next-auth/providers';

// --- Naver Provider (Custom OAuth2) ---
const NaverProvider: OAuthConfig<any> = {
  id: 'naver',
  name: 'Naver',
  type: 'oauth',
  wellKnown: undefined,
  authorization: {
    url: 'https://nid.naver.com/oauth2.0/authorize',
    params: { response_type: 'code' },
  },
  token: 'https://nid.naver.com/oauth2.0/token',
  userinfo: 'https://openapi.naver.com/v1/nid/me',
  clientId: process.env.NAVER_CLIENT_ID!,
  clientSecret: process.env.NAVER_CLIENT_SECRET!,
  profile: (profile: any) => {
    // Naver 응답: { resultcode, message, response: { id, email, name, ... } }
    const p = profile?.response ?? {};
    return {
      id: p.id,
      name: p.name || p.nickname || 'Naver User',
      email: p.email ?? null,
      image: p.profile_image ?? null,
    };
  },
};

// --- Kakao Provider (Custom OAuth2) ---
const KakaoProvider: OAuthConfig<any> = {
  id: 'kakao',
  name: 'Kakao',
  type: 'oauth',
  authorization: {
    url: 'https://kauth.kakao.com/oauth/authorize',
    params: { response_type: 'code' },
  },
  token: 'https://kauth.kakao.com/oauth/token',
  userinfo: 'https://kapi.kakao.com/v2/user/me',
  clientId: process.env.KAKAO_CLIENT_ID!,
  clientSecret: process.env.KAKAO_CLIENT_SECRET, // 대개 불필요하면 undefined 가능
  profile: (profile: any) => {
    // Kakao 응답: { id, kakao_account: { email, profile: { nickname, profile_image_url } } }
    const acc = profile?.kakao_account ?? {};
    const prof = acc.profile ?? {};
    return {
      id: String(profile.id),
      name: prof.nickname || 'Kakao User',
      email: acc.email ?? null,
      image: prof.profile_image_url ?? null,
    };
  },
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    NaverProvider,
    KakaoProvider,
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, profile }) {
      // 최초 로그인 시 provider 정보 보강
      if (account) {
        token.provider = account.provider;
        token.providerId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // 클라이언트에서 provider 확인이 필요하면 세션에 반영
      (session as any).provider = token.provider;
      (session as any).providerId = token.providerId;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login', // 커스텀 로그인 페이지 (선택사항)
    error: '/auth/error', // 에러 페이지 (선택사항)
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
