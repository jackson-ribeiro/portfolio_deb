import { getSettings } from "@/lib/settings";
interface ContactItem {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default async function ContactPage() {
  const settings = await getSettings();

  const contacts: ContactItem[] = [];

  if (settings.email) {
    contacts.push({
      href: `mailto:${settings.email}`,
      label: "Email",
      value: settings.email,
      icon: (
        <svg className="w-6 h-6 text-zinc-600 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    });
  }

  if (settings.linkedinUrl) {
    contacts.push({
      href: settings.linkedinUrl,
      label: "LinkedIn",
      value: settings.linkedinUrl.replace("https://", "").replace("www.", ""),
      icon: (
        <svg className="w-6 h-6 text-zinc-600 dark:text-zinc-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    });
  }

  if (settings.instagramUrl) {
    contacts.push({
      href: settings.instagramUrl,
      label: "Instagram",
      value: `@${settings.instagramUrl.split("/").pop()}`,
      icon: (
        <svg className="w-6 h-6 text-zinc-600 dark:text-zinc-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    });
  }

  const hasContacts = contacts.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8 animate-fade-in-up">
        Contato
      </h1>

      <div className="space-y-8">
        <p className="text-lg text-zinc-600 dark:text-zinc-400 animate-fade-in-up delay-100">
          {hasContacts
            ? "Interessado em trabalhar junto? Entre em contato através das opções abaixo."
            : "Configure suas informações de contato no painel administrativo."}
        </p>

        {hasContacts && (
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={contact.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                  {contact.icon}
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{contact.label}</p>
                  <p className="text-zinc-600 dark:text-zinc-400">{contact.value}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
