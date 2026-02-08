"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { DynamicList } from "./DynamicList";
import type { SiteSettings, Skill, Experience, Education } from "@/types";

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export function SettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [formData, setFormData] = useState<SiteSettings>({
    id: "site-settings",
    name: "",
    title: "",
    bio: "",
    profilePhotoUrl: null,
    profilePhotoId: null,
    resumeUrl: null,
    resumeId: null,
    email: "",
    linkedinUrl: null,
    instagramUrl: null,
    skills: [],
    experiences: [],
    education: [],
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Configurações salvas com sucesso!" });
      } else {
        setMessage({ type: "error", text: "Erro ao salvar configurações" });
      }
    } catch {
      setMessage({ type: "error", text: "Erro ao salvar configurações" });
    } finally {
      setSaving(false);
    }
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProfile(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("type", "profile");

    try {
      const res = await fetch("/api/settings/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          profilePhotoUrl: data.url,
          profilePhotoId: data.publicId,
        }));
      }
    } catch {
      setMessage({ type: "error", text: "Erro ao enviar foto" });
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("type", "resume");

    try {
      const res = await fetch("/api/settings/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          resumeUrl: data.url,
          resumeId: data.publicId,
        }));
      }
    } catch {
      setMessage({ type: "error", text: "Erro ao enviar currículo" });
    } finally {
      setUploadingResume(false);
    }
  };

  // Skills handlers
  const addSkill = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { id: generateId(), name: "" }],
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  }, []);

  const updateSkill = useCallback((id: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, name } : s)),
    }));
  }, []);

  // Experiences handlers
  const addExperience = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { id: generateId(), role: "", company: "", period: "", description: "" },
      ],
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  }, []);

  const updateExperience = useCallback((id: string, field: keyof Experience, value: string) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }));
  }, []);

  // Education handlers
  const addEducation = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: generateId(), course: "", institution: "", period: "" },
      ],
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  }, []);

  const updateEducation = useCallback((id: string, field: keyof Education, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Dados Pessoais */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          Dados Pessoais
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-200">
                {formData.profilePhotoUrl ? (
                  <img
                    src={formData.profilePhotoUrl}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mt-2 space-y-1">
                <label className="block">
                  <span className="sr-only">Escolher foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileUpload}
                    disabled={uploadingProfile}
                    className="block w-full text-sm text-zinc-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
                  />
                </label>
                {formData.profilePhotoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, profilePhotoUrl: null, profilePhotoId: null })}
                    className="text-xs text-red-600 hover:text-red-700 hover:underline"
                  >
                    Remover foto
                  </button>
                )}
              </div>
              {uploadingProfile && (
                <p className="text-xs text-zinc-500 mt-1">Enviando...</p>
              )}
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Título/Profissão"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>
          <Textarea
            label="Bio"
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          Habilidades
        </h2>
        <DynamicList<Skill>
          items={formData.skills}
          onAdd={addSkill}
          onRemove={removeSkill}
          addLabel="Adicionar Habilidade"
          emptyMessage="Nenhuma habilidade adicionada"
          renderItem={(skill) => (
            <Input
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, e.target.value)}
              placeholder="Ex: Direção de Arte"
            />
          )}
        />
      </div>

      {/* Experiências */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          Experiências
        </h2>
        <DynamicList<Experience>
          items={formData.experiences}
          onAdd={addExperience}
          onRemove={removeExperience}
          addLabel="Adicionar Experiência"
          emptyMessage="Nenhuma experiência adicionada"
          renderItem={(exp) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Cargo"
                value={exp.role}
                onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
              />
              <Input
                label="Empresa"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
              />
              <Input
                label="Período"
                value={exp.period}
                onChange={(e) => updateExperience(exp.id, "period", e.target.value)}
                placeholder="Ex: 2020 - Presente"
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Descrição"
                  rows={2}
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                />
              </div>
            </div>
          )}
        />
      </div>

      {/* Formação */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          Formação
        </h2>
        <DynamicList<Education>
          items={formData.education}
          onAdd={addEducation}
          onRemove={removeEducation}
          addLabel="Adicionar Formação"
          emptyMessage="Nenhuma formação adicionada"
          renderItem={(edu) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                label="Curso"
                value={edu.course}
                onChange={(e) => updateEducation(edu.id, "course", e.target.value)}
              />
              <Input
                label="Instituição"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
              />
              <Input
                label="Período"
                value={edu.period}
                onChange={(e) => updateEducation(edu.id, "period", e.target.value)}
                placeholder="Ex: 2018 - 2022"
              />
            </div>
          )}
        />
      </div>

      {/* Contato e Redes Sociais */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          Contato e Redes Sociais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="LinkedIn"
            type="url"
            value={formData.linkedinUrl || ""}
            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value || null })}
            placeholder="https://linkedin.com/in/seu-perfil"
          />
          <Input
            label="Instagram"
            type="url"
            value={formData.instagramUrl || ""}
            onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value || null })}
            placeholder="https://instagram.com/seu-perfil"
          />
        </div>
      </div>

      {/* Currículo */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          Currículo
        </h2>
        <div className="space-y-3">
          {formData.resumeUrl && (
            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
              <a
                href={formData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-900 hover:underline"
              >
                Ver currículo atual
              </a>
            </div>
          )}
          <label className="block">
            <span className="text-sm text-zinc-600">
              {formData.resumeUrl ? "Substituir currículo:" : "Enviar currículo (PDF):"}
            </span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              disabled={uploadingResume}
              className="mt-1 block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
            />
          </label>
          {uploadingResume && (
            <p className="text-sm text-zinc-500">Enviando currículo...</p>
          )}
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          Salvar Configurações
        </Button>
      </div>
    </form>
  );
}
