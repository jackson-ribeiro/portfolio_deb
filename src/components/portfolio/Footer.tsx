export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-20 transition-colors">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>&copy; {currentYear} Déborah. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
