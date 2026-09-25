// Copia as mídias referenciadas no banco local da pasta de produção do
// Cloudinary ("portfolio/") para a pasta deste ambiente (CLOUDINARY_FOLDER) e
// atualiza o banco local para apontar para as cópias.
//
// Nunca apaga nem altera arquivos de produção: a cópia é um upload novo a
// partir da URL pública. Rodar de novo reaproveita as cópias já existentes.
//
// Normalmente roda via `npm run sync:prod` (scripts/sync-from-prod.sh).
import { PrismaClient } from "@prisma/client";
import { cloudinary, CLOUDINARY_FOLDER } from "../src/lib/cloudinary";

const PROD_FOLDER = "portfolio";

type ResourceType = "image" | "video" | "raw";

const prisma = new PrismaClient();

async function copyToDev(url: string, publicId: string, resourceType: ResourceType) {
  if (!publicId.startsWith(`${PROD_FOLDER}/`)) return null;

  // "portfolio/profile/abc" -> pasta "portfolio-dev/profile", id "abc"
  const rest = publicId.slice(PROD_FOLDER.length + 1);
  const slash = rest.lastIndexOf("/");
  const subfolder = slash === -1 ? "" : `/${rest.slice(0, slash)}`;
  const name = rest.slice(slash + 1);
  const expectedId = `${CLOUDINARY_FOLDER}/${rest}`;

  const result = await cloudinary.uploader.upload(url, {
    resource_type: resourceType,
    folder: `${CLOUDINARY_FOLDER}${subfolder}`,
    public_id: name,
    overwrite: false,
    timeout: 10 * 60 * 1000,
  });

  if (result.public_id !== expectedId) {
    throw new Error(`Cópia de ${publicId} ficou como ${result.public_id}, esperado ${expectedId}`);
  }
  return { url: result.secure_url as string, publicId: result.public_id as string };
}

async function main() {
  if (!process.env.CLOUDINARY_FOLDER || CLOUDINARY_FOLDER === PROD_FOLDER) {
    throw new Error(`Defina CLOUDINARY_FOLDER no .env com uma pasta diferente de "${PROD_FOLDER}".`);
  }
  if (!/@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL ?? "")) {
    throw new Error("DATABASE_URL não aponta para localhost; abortando.");
  }

  let copied = 0;

  const media = await prisma.media.findMany();
  for (const m of media) {
    const copy = await copyToDev(m.url, m.publicId, m.type === "video" ? "video" : "image");
    if (!copy) continue;
    await prisma.media.update({ where: { id: m.id }, data: copy });
    copied++;
    console.log(`  ${m.publicId} -> ${copy.publicId}`);
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: "site-settings" } });
  if (settings?.profilePhotoUrl && settings.profilePhotoId) {
    const copy = await copyToDev(settings.profilePhotoUrl, settings.profilePhotoId, "image");
    if (copy) {
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: { profilePhotoUrl: copy.url, profilePhotoId: copy.publicId },
      });
      copied++;
      console.log(`  ${settings.profilePhotoId} -> ${copy.publicId}`);
    }
  }
  if (settings?.resumeUrl && settings.resumeId) {
    const copy = await copyToDev(settings.resumeUrl, settings.resumeId, "raw");
    if (copy) {
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: { resumeUrl: copy.url, resumeId: copy.publicId },
      });
      copied++;
      console.log(`  ${settings.resumeId} -> ${copy.publicId}`);
    }
  }

  console.log(`${copied} arquivo(s) copiados para "${CLOUDINARY_FOLDER}/".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
