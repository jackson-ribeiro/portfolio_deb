import Link from "next/link";

const skills = [
  {
    name: "Direção de Arte",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Produção Audiovisual",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Social Media",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
  {
    name: "Fotografia",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: "Edição de Vídeo",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    name: "Branding",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

const experiences = [
  {
    period: "2023 - Presente",
    role: "Freelancer",
    company: "Criação de Conteúdo",
    description: "Produção de conteúdo audiovisual para marcas e empresas.",
  },
  {
    period: "2022 - 2023",
    role: "Estagiária",
    company: "Agência de Publicidade",
    description: "Atuação em campanhas publicitárias e gestão de redes sociais.",
  },
  {
    period: "2020 - 2022",
    role: "Projetos Acadêmicos",
    company: "Universidade",
    description: "Desenvolvimento de projetos de comunicação visual e branding.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            Olá, prazer!
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            Sou a <span className="text-zinc-900 dark:text-white font-medium">Déborah</span>,
            publicitária apaixonada por transformar ideias em experiências visuais marcantes.
          </p>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            Com experiência em produção audiovisual, direção de arte e estratégia de comunicação,
            busco sempre criar conexões autênticas entre marcas e pessoas através de imagens e vídeos impactantes.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/cv-deborah.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Baixar Currículo
            </a>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-full font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Entrar em Contato
            </Link>
          </div>
        </div>

        {/* Foto placeholder */}
        <div className="animate-fade-in-up delay-200">
          <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 overflow-hidden relative">
            {/* Substitua este div pela imagem real */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-20 h-20 text-zinc-400 dark:text-zinc-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Adicione sua foto aqui</p>
              </div>
            </div>
            {/* Para usar uma imagem real, descomente abaixo e adicione a URL */}
            {/* <img
              src="/sua-foto.jpg"
              alt="Déborah"
              className="w-full h-full object-cover"
            /> */}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 animate-fade-in-up">
          O que eu faço
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center mb-4 text-zinc-600 dark:text-zinc-300">
                {skill.icon}
              </div>
              <h3 className="font-medium text-zinc-900 dark:text-white">
                {skill.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 animate-fade-in-up">
          Experiência
        </h2>
        <div className="space-y-0">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="relative pl-8 pb-8 border-l-2 border-zinc-200 dark:border-zinc-700 last:pb-0 animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 0.15}s` }}
            >
              {/* Timeline dot */}
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
                <p className="text-zinc-600 dark:text-zinc-400 mt-3">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 animate-fade-in-up">
          Formação
        </h2>
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 animate-fade-in-up delay-100">
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
                Publicidade e Propaganda
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Bacharelado • Em andamento
              </p>
            </div>
          </div>
        </div>
      </section>

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
