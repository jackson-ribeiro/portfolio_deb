import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Pasta raiz das mídias deste ambiente no Cloudinary. Produção usa "portfolio"
// (padrão); no desenvolvimento local, CLOUDINARY_FOLDER="portfolio-dev" no .env
// separa os arquivos dentro da mesma conta.
export const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "portfolio";

// Só apaga arquivos da pasta deste ambiente. Assim, um banco local copiado da
// produção não consegue apagar as mídias de produção.
export async function destroyOwnFile(
  publicId: string,
  resourceType: "image" | "video" | "raw"
) {
  if (!publicId.startsWith(`${CLOUDINARY_FOLDER}/`)) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export { cloudinary };
