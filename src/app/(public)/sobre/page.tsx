import Link from "next/link";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getSettings();

  const hasContent = settings.name || settings.bio;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            Olá, prazer!
          </h1>
          {hasContent ? (
            <>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Sou {settings.name && <span className="text-zinc-900 dark:text-white font-medium">{settings.name}</span>}
                {settings.title && `, ${settings.title}`}.
              </p>
              {settings.bio && (
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed whitespace-pre-line">
                  {settings.bio}
                </p>
              )}
            </>
          ) : (
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
              Configure seus dados no painel administrativo.
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            {settings.resumeUrl && (
              <a
                href={settings.resumeUrl}
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Baixar Currículo
              </a>
            )}
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-full font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Entrar em Contato
            </Link>
          </div>
        </div>

        {/* Foto */}
        <div className="animate-fade-in-up delay-200">
          <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 overflow-hidden relative">
            {settings.profilePhotoUrl ? (
              <img
                src={settings.profilePhotoUrl}
                alt={settings.name || "Foto de perfil"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 text-zinc-400 dark:text-zinc-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Adicione sua foto aqui</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {settings.skills.length > 0 && (
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 animate-fade-in-up">
            O que eu faço
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {settings.skills.map((skill, index) => (
              <div
                key={skill.id}
                className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center mb-4 text-zinc-600 dark:text-zinc-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-medium text-zinc-900 dark:text-white">
                  {skill.name}
                </h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Timeline */}
      {settings.experiences.length > 0 && (
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 animate-fade-in-up">
            Experiência
          </h2>
          <div className="space-y-0">
            {settings.experiences.map((exp, index) => (
              <div
                key={exp.id}
                className="relative pl-8 pb-8 border-l-2 border-zinc-200 dark:border-zinc-700 last:pb-0 animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 0.15}s` }}
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 bg-zinc-900 dark:bg-white rounded-full" />
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 ml-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                    {exp.period}
                  </span>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mt-1">
                    {exp.role}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
                    {exp.company}
                  </p>
                  {exp.description && (
                    <p className="text-zinc-600 dark:text-zinc-400 mt-3">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {settings.education.length > 0 && (
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 animate-fade-in-up">
            Formação
          </h2>
          <div className="space-y-4">
            {settings.education.map((edu, index) => (
              <div
                key={edu.id}
                className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-zinc-600 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {edu.course}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {edu.institution} {edu.period && `• ${edu.period}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="text-center py-12 animate-fade-in-up">
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
          Vamos trabalhar juntos?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg mx-auto">
          Estou sempre aberta a novos projetos e colaborações.
          Entre em contato e vamos criar algo incrível!
        </p>
        <Link
          href="/contato"
          className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
        >
          Entrar em Contato
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
