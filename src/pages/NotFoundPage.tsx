import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[900px] px-6 py-40 md:px-10">
        <h1 className="mb-8 text-4xl tracking-tight md:text-5xl">
          Page not found
        </h1>
        <Link to="/" className="text-muted underline underline-offset-4">
          Back to the index
        </Link>
      </main>
      <Footer />
    </>
  );
}
