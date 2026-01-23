import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#1B6B7A] text-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="mb-8">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="becoming lab"
              width={160}
              height={40}
              className="h-8 w-auto brightness-0 invert mb-4"
            />
          </Link>
          <p className="text-sm opacity-80 leading-relaxed">
            更新を重ねる人生を。<br />
            Layering renewal into life.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm opacity-70 mb-12">
          <Link href="/concept" className="hover:opacity-100 transition-opacity">
            Concept
          </Link>
          <Link href="/kataribe" className="hover:opacity-100 transition-opacity">
            語り部の会
          </Link>
          <Link href="/community" className="hover:opacity-100 transition-opacity">
            Community
          </Link>
          <Link href="/service" className="hover:opacity-100 transition-opacity">
            Service
          </Link>
          <Link href="/contact" className="hover:opacity-100 transition-opacity">
            Contact
          </Link>
        </div>
        <div className="pt-8 border-t border-white/20">
          <p className="text-xs opacity-50">
            © 2026 becoming lab
          </p>
        </div>
      </div>
    </footer>
  );
}
