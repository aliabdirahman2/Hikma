import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
  { href: "/resources", label: "Resources" },
];

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-8 text-center text-muted-foreground">
        <div className="flex justify-center gap-4 md:gap-6 mb-6">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm hover:text-primary transition-colors">
                {link.label}
            </Link>
          ))}
        </div>
        <div className="max-w-xl mx-auto text-sm">
            <p className="font-arabic" dir="rtl">وَمَن يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا</p>
            <p className="italic mt-1">“Whoever is given wisdom has truly been given abundant good.” — Qur’an 2:269</p>
        </div>
      </div>
    </footer>
  );
}
