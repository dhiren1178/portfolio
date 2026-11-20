const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix a file from public/ with the deployment path. Next.js handles route links separately. */
export function publicAsset(path: `/${string}`): string {
  return `${basePath}${path}`;
}
