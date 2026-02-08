import { SettingsForm } from "@/components/admin/SettingsForm";

export default function ConfiguracoesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Configurações</h1>
        <p className="text-zinc-600">Gerencie as informações do seu site</p>
      </div>

      <SettingsForm />
    </div>
  );
}
