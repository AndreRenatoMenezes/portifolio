"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { type ItemIcon } from "@/components/icons/ItemIcons";
import { ProjectIcon } from "@/components/ProjectIcon";
import { ProjectLinks } from "@/components/ProjectLinks";
import type { Dictionary, Locale } from "@/lib/i18n";
import { track } from "@/lib/analytics";
import { playCursor, playItemGet } from "@/lib/sound";

/** Versão já traduzida do projeto, segura para enviar ao cliente. */
export type InventoryItem = {
  slug: string;
  title: string;
  kind: string;
  role: string;
  outcome: string;
  summary: string;
  item: ItemIcon;
  icon?: { src: string; width: number; height: number };
  stats: { value: string; label: string }[];
  tags: string[];
  year: number;
  cover?: { src: string; width: number; height: number; alt: string };
  links: { demo?: string; github?: string };
  private?: boolean;
};

/** Atributos do item, estilo ficha de RPG. */
function Stats({ stats }: { stats: InventoryItem["stats"] }) {
  return (
    <dl className="item-stats">
      {stats.slice(0, 3).map((s) => (
        <div key={s.label}>
          <dt>{s.label}</dt>
          <dd>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

type Props = {
  lang: Locale;
  items: InventoryItem[];
  dict: Dictionary["inventory"];
  modalDict: Dictionary["modal"];
  projectDict: Dictionary["project"];
};

export function Inventory({ lang, items, dict, modalDict, projectDict }: Props) {
  const [open, setOpen] = useState<InventoryItem | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const openerRef = useRef<HTMLAnchorElement | null>(null);
  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const active = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-index]");
    if (!active) return;
    const index = Number(active.dataset.index);
    if (!Number.isInteger(index)) return;
    const columns = getComputedStyle(e.currentTarget).gridTemplateColumns.split(" ").length;
    const moves: Record<string, number> = {
      ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns,
    };
    if (e.key in moves) {
      e.preventDefault();
      const next = index + moves[e.key];
      const slot = listRef.current?.querySelector<HTMLAnchorElement>(`[data-index="${next}"]`);
      if (slot) { slot.focus(); playCursor(); }
    } else if (e.key === "Home") {
      e.preventDefault();
      listRef.current?.querySelector<HTMLAnchorElement>('[data-index="0"]')?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      listRef.current?.querySelector<HTMLAnchorElement>(`[data-index="${items.length - 1}"]`)?.focus();
    }
  };

  return (
    <div className="inventory" data-inventory>
      <ul className="inventory-sheets" ref={listRef} onKeyDown={onKeyDown}>
        {items.map((item, i) => (
          <li key={item.slug}>
            <article className="item-sheet dialog-frame">
              <Link
                ref={i === 0 ? undefined : undefined}
                href={`/${lang}/projects/${item.slug}`}
                prefetch={false}
                aria-label={`${dict.open}: ${item.title}`}
                data-index={i}
                className="slot item-sheet-slot"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  openerRef.current = e.currentTarget;
                  setOpen(item);
                }}
              >
                <ProjectIcon icon={item.icon} item={item.item} size={56} />
                <span className="target-cursor" aria-hidden="true" />
              </Link>
              <div className="item-sheet-body">
          <p className="item-panel-label">{item.kind} · {item.year}</p>
          <h3 className="item-sheet-title">{item.title}</h3>
          <p className="item-sheet-summary">{item.summary}</p>
          <dl className="project-role-outcome">
            <div>
              <dt>{projectDict.role}</dt>
              <dd>{item.role}</dd>
            </div>
            <div>
              <dt>{projectDict.outcome}</dt>
              <dd>{item.outcome}</dd>
            </div>
          </dl>
          <Stats stats={item.stats} />
          <ul className="tags">
            {item.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <ProjectLinks
            lang={lang}
            slug={item.slug}
            title={item.title}
            links={item.links}
            isPrivate={item.private}
            liveLabel={projectDict.live}
            codeLabel={projectDict.code}
            askDemoLabel={modalDict.askDemo}
            privateTitle={modalDict.private}
            moreLabel={modalDict.more}
            showDetails
          />
              </div>
            </article>
          </li>
        ))}
      </ul>

      <ItemGetModal
        lang={lang}
        item={open}
        dict={modalDict}
        projectDict={projectDict}
        onClose={() => { setOpen(null); requestAnimationFrame(() => openerRef.current?.focus()); }}
      />
    </div>
  );
}

function ItemGetModal({
  lang,
  item,
  dict,
  projectDict,
  onClose,
}: {
  lang: Locale;
  item: InventoryItem | null;
  dict: Dictionary["modal"];
  projectDict: Dictionary["project"];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (item && !dialog.open) {
      dialog.showModal();
      playItemGet();
      track("item_open", { slug: item.slug });
    } else if (!item && dialog.open) {
      dialog.close();
    }
  }, [item]);

  return (
    <dialog
      ref={ref}
      className="item-get"
      aria-labelledby="item-get-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // clique no fundo
      }}
    >
      {item && (
        <div className="item-get-inner dialog-frame">
          <div className="item-get-hero" aria-hidden="true">
            <span className="item-get-rays" />
            <span className="item-get-icon">
            <ProjectIcon icon={item.icon} item={item.item} size={72} />
            </span>
          </div>
          <p className="item-get-kicker">
            {dict.obtained} · {item.kind}
          </p>
          <h3 id="item-get-title" className="item-get-title">
            {item.title}!
          </h3>
          {item.cover && (
            <Image
              className="item-get-cover"
              src={item.cover.src}
              alt={item.cover.alt}
              width={item.cover.width}
              height={item.cover.height}
              loading="lazy"
              sizes="(max-width: 640px) 90vw, 560px"
              unoptimized={item.cover.src.endsWith(".svg")}
            />
          )}
          <p>{item.summary}</p>
          <dl className="project-role-outcome">
            <div>
              <dt>{projectDict.role}</dt>
              <dd>{item.role}</dd>
            </div>
            <div>
              <dt>{projectDict.outcome}</dt>
              <dd>{item.outcome}</dd>
            </div>
          </dl>
          <Stats stats={item.stats} />
          <ProjectLinks
            lang={lang}
            slug={item.slug}
            title={item.title}
            links={item.links}
            isPrivate={item.private}
            liveLabel={projectDict.live}
            codeLabel={projectDict.code}
            askDemoLabel={dict.askDemo}
            privateTitle={dict.private}
            moreLabel={dict.more}
            showDetails
            onAction={onClose}
          />
          <button type="button" className="item-get-close" onClick={onClose} aria-label={dict.close}>
            ✕
          </button>
        </div>
      )}
    </dialog>
  );
}
