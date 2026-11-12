import { ImageResponse } from "next/og";
import { OgFrame, ogSize } from "@/components/OgFrame";
import { profile } from "@/content/profile";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";

export const size = ogSize;
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.role.en}`;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : "pt";
  const dict = getDictionary(lang);

  return new ImageResponse(
    (
      <OgFrame footer={dict.meta.title}>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800, lineHeight: 1.05, marginTop: 70 }}>{profile.name}</div>
        <div style={{ display: "flex", fontSize: 40, color: "#f0c75e", letterSpacing: 6, marginTop: 14, textTransform: "uppercase" }}>
          {profile.role[lang]} · {profile.home[lang]}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            maxWidth: 860,
            padding: "22px 28px",
            fontSize: 30,
            lineHeight: 1.35,
            borderRadius: 18,
            border: "3px solid rgba(240,199,94,0.55)",
            background: "rgba(6,10,26,0.82)",
          }}
        >
          {dict.meta.description}
        </div>
      </OgFrame>
    ),
    size,
  );
}
