"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ItemIconSvg, type ItemIcon } from "@/components/icons/ItemIcons";
import type { Dictionary, Locale } from "@/lib/i18n";
import { playCursor, playItemGet } from "@/lib/sound";

/** Versão já traduzida do projeto, segura para enviar ao cliente. */
export type InventoryItem = {
  slug: string;
  title: string;
  summary: string;
  item: ItemIcon;
  tags: string[];
  year: number;
  cover?: { src: string; alt: string };
  links: { demo?: string; github?: string };
};

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
  const slotRefs = useRef<(HTMLButtonElement | null)[]>([]);
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
            <button
              key={item.slug}
              ref={(node) => {
                slotRefs.current[i] = node;
              }}
              type="button"
              className="slot"
              data-selected={i === selected || undefined}
              tabIndex={i === selected ? 0 : -1}
              aria-label={`${item.title} — ${dict.open}`}
              onMouseEnter={() => select(i)}
              onFocus={() => select(i)}
              onClick={() => setOpen(item)}
            >
              <ItemIconSvg name={item.item} size={44} />
              {i === selected && <span className="target-cursor" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {current && (
        <aside className="item-panel dialog-frame" aria-live="polite">
          <p className="item-panel-label">{dict.selected}</p>
          <h3 className="item-panel-title">{current.title}</h3>
          <p>{current.summary}</p>
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
          <p className="item-get-kicker">{dict.obtained}</p>
          <h3 id="item-get-title" className="item-get-title">
            {item.title}!
          </h3>
          {item.cover && (
            <Image
              className="item-get-cover"
              src={item.cover.src}
              alt={item.cover.alt}
              width={960}
              height={600}
              sizes="(max-width: 640px) 90vw, 560px"
              unoptimized={item.cover.src.endsWith(".svg")}
            />
          )}
          <p>{item.summary}</p>
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
