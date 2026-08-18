import { LocalizedLink as Link } from '../lib/language';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useT } from '../lib/i18n';
import { useSeo } from '../lib/seo';

export function NotFoundPage() {
  const t = useT();

  useSeo({
    title: t('error.pageNotFound'),
    description: 'The page you are looking for does not exist.',
    noindex: true,
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[900px] px-6 py-40 md:px-10">
        <h1 className="mb-8 text-4xl tracking-tight md:text-5xl">
          {t('error.pageNotFound')}
        </h1>
        <Link to="/" className="text-muted underline underline-offset-4">
          {t('error.backToIndex')}
        </Link>
      </main>
      <Footer />
    </>
  );
}
