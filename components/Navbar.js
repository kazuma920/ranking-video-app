import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/">
        <span className="brand">RANKING <span>VIDEO</span></span>
      </Link>
      <Link href="/upload">+ Upload</Link>
    </nav>
  );
}
