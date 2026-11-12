import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ItemIconSvg } from "@/components/icons/ItemIcons";
import { OgFrame, ogSize } from "@/components/OgFrame";
import { profile } from "@/content/profile";
import { getProject, projects } from "@/content/projects";
import { hasLocale, locales } from "@/lib/i18n";

export const size = ogSize;
export const contentType = "image/png";
export const alt = `Projeto de ${profile.name}`;
export const generateStaticParams = () =>
  locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: raw, slug } = await params;
  const lang = hasLocale(raw) ? raw : "pt";
  const project = getProject(slug) ?? projects[0];
  const iconData = project.icon
    ? `data:image/svg+xml;base64,${(await readFile(join(process.cwd(), "public", project.icon.src))).toString("base64")}`
    : null;

  return new ImageResponse(
    (
      <OgFrame footer={`${profile.name} · ${profile.role[lang]}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 180,
              height: 180,
              borderRadius: 28,
              border: "4px solid rgba(240,199,94,0.6)",
              background: "rgba(6,10,26,0.85)",
            }}
          >
            {iconData ? (
              <img src={iconData} width={128} height={128} alt="" />
            ) : <ItemIconSvg name={project.item} size={128} />}
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 28, color: "#f0c75e", letterSpacing: 4, textTransform: "uppercase" }}>
              {project.kind[lang]}
            </div>
            <div style={{ display: "flex", fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 8 }}>
              {project.title[lang]}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 22, marginTop: 52 }}>
          {project.stats.slice(0, 3).map((s) => (
            <div
              key={s.label.en}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 300,
                padding: "18px 12px",
                borderRadius: 18,
                border: "2px solid rgba(240,199,94,0.35)",
                background: "rgba(6,10,26,0.78)",
              }}
            >
              <div style={{ display: "flex", fontSize: 56, fontWeight: 800, color: "#f0c75e" }}>{s.value}</div>
              <div style={{ display: "flex", fontSize: 24, color: "#b9c0d8", textAlign: "center" }}>{s.label[lang]}</div>
            </div>
          ))}
        </div>
      </OgFrame>
    ),
    size,
  );
}
