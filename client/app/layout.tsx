import { Layout } from '@/components/dom/Layout'
import { Metadata, Viewport } from 'next'
import { APP_INFO } from './appInfo'
import localFont from 'next/font/local'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import '@/styles/global.css'

export const metadata: Metadata = {
  alternates: {
    canonical: APP_INFO.url,
  },
  title: {
    default: APP_INFO.title,
    template: APP_INFO.titleTemplate,
  },
  description: APP_INFO.description,
  keywords: APP_INFO.keywords,
  authors: APP_INFO.authors,
  creator: 'SEJIN OH',
  publisher: 'SEJIN OH',
  manifest: '/manifest.json',
  generator: 'SEJIN OH',
  applicationName: APP_INFO.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_INFO.title,
    // startUpImage: [],
  },
  category: 'webapp',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_INFO.name,
    title: {
      default: APP_INFO.title,
      template: APP_INFO.titleTemplate,
    },
    description: APP_INFO.description,
    locale: 'ko_KR',
    url: APP_INFO.url,
    images: {
      url: '/icons/op-image.png',
    },
  },
  verification: {
    google: APP_INFO.google_site_verification,
  },
  referrer: 'origin-when-cross-origin',
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/apple-touch-icon.png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32' },
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32' },
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: {
      rel: 'mask-icon',
      url: '/icons/safari-pinned-tab.svg',
      color: '#000000',
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  themeColor: '#000000',
  userScalable: false,
  viewportFit: 'cover',
}

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
})

const wixMadeForDisplay = localFont({
  src: '../public/fonts/WixMadeforDisplay-VariableFont_wght.woff2',
  display: 'swap',
  weight: '400',
  variable: '--font-wix-made-for-display',
})

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${pretendard.className} ${wixMadeForDisplay.className}`}>
        <Layout>{children}</Layout>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  )
}
