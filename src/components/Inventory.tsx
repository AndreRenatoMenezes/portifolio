"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ItemIconSvg, type ItemIcon } from "@/components/icons/ItemIcons";
import type { Dictionary, Locale } from "@/lib/i18n";
import { track } from "@/lib/analytics";
import { playCursor, playItemGet } from "@/lib/sound";

/** Versão já traduzida do projeto, segura para enviar ao cliente. */
export type InventoryItem = {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  item: ItemIcon;
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
};

const SLOTS_PER_PAGE = 12; // divisível por 3 e 4 (colunas mobile/desktop)

export function Inventory({ lang, items, dict, modalDict }: Props) {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState<InventoryItem | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const totalSlots = Math.max(SLOTS_PER_PAGE, Math.ceil((items.length + 1) / SLOTS_PER_PAGE) * SLOTS_PER_PAGE);
  const current = items[selected];

  const select = (index: number, focus = false) => {
    if (index < 0 || index >= items.length) return;
    if (index !== selected) playCursor();
    setSelected(index);
    if (focus) slotRefs.current[index]?.focus();
  };

  const columns = () => {
    const grid = gridRef.current;
    if (!grid) return 4;
    return getComputedStyle(grid).gridTemplateColumns.split(" ").length;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -columns(),
      ArrowDown: columns(),
    };
    if (e.key in moves) {
      e.preventDefault();
      select(selected + moves[e.key], true);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      select(items.length - 1, true);
    }
  };

  return (
    <div className="inventory" data-inventory>
      <div className="inventory-grid dialog-frame" ref={gridRef} onKeyDown={onKeyDown}>
        {Array.from({ length: totalSlots }, (_, i) => {
          const item = items[i];
          if (!item) {
            return <div key={`empty-${i}`} className="slot slot-empty" aria-hidden="true" title={dict.empty} />;
          }
          return (
            <Link
              key={item.slug}
              ref={(node) => {
                slotRefs.current[i] = node;
              }}
              href={`/${lang}/projects/${item.slug}`}
              prefetch={false}
              data-opens-modal
              className="slot"
              data-selected={i === selected || undefined}
              tabIndex={i === selected ? 0 : -1}
              onMouseEnter={() => select(i)}
              onFocus={() => select(i)}
              onClick={(e) => {
                // Clique simples abre o modal; com modificador (nova aba etc.) segue o link.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setOpen(item);
              }}
            >
              <ItemIconSvg name={item.item} size={44} />
              <span className="slot-name">{item.title}</span>
              {i === selected && <span className="target-cursor" aria-hidden="true" />}
            </Link>
          );
        })}
      </div>

      {current && (
        <aside className="item-panel dialog-frame" aria-live="polite">
          <p className="item-panel-label">
            {dict.selected} · {current.kind}
          </p>
          <h3 className="item-panel-title">{current.title}</h3>
          <p>{current.summary}</p>
          <Stats stats={current.stats} />
          <ul className="tags">
            {current.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <button type="button" className="btn btn-primary" onClick={() => setOpen(current)}>
            {dict.open}
          </button>
        </aside>
      )}

      <ItemGetModal lang={lang} item={open} dict={modalDict} onClose={() => setOpen(null)} />
    </div>
  );
}

function ItemGetModal({
  lang,
  item,
  dict,
  onClose,
}: {
  lang: Locale;
  item: InventoryItem | null;
  dict: Dictionary["modal"];
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
              <ItemIconSvg name={item.item} size={72} />
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
              sizes="(max-width: 640px) 90vw, 560px"
              unoptimized={item.cover.src.endsWith(".svg")}
            />
          )}
          <p>{item.summary}</p>
          <Stats stats={item.stats} />
          <div className="btn-row">
            {item.links.demo && (
              <a className="btn btn-primary" href={item.links.demo} target="_blank" rel="noreferrer">
                {dict.demo} ↗
              </a>
            )}
            {item.links.github && (
              <a className="btn" href={item.links.github} target="_blank" rel="noreferrer">
                {dict.github} ↗
              </a>
            )}
            {item.private && (
              <a className="btn" href={`/${lang}#contact`} onClick={onClose} title={dict.private}>
                🔒 {dict.askDemo}
              </a>
            )}
            <Link className="btn" href={`/${lang}/projects/${item.slug}`}>
              {dict.more} →
            </Link>
          </div>
          <button type="button" className="item-get-close" onClick={onClose} aria-label={dict.close}>
            ✕
          </button>
        </div>
      )}
    </dialog>
  );
}
