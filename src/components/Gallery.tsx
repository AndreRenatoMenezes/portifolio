"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  images: { src: string; alt: string }[];
  dict: Dictionary["project"];
  closeLabel: string;
};

/** Grade de prints com lightbox em <dialog> nativo (Esc fecha, foco preso). */
export function Gallery({ images, dict, closeLabel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const image = images[index];
  const many = images.length > 1;

  const openAt = (i: number) => {
    setIndex(i);
    ref.current?.showModal();
  };
  const step = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  return (
    <>
      <ul className="gallery">
        {images.map((img, i) => (
          <li key={img.src}>
            <button type="button" className="gallery-thumb dialog-frame" onClick={() => openAt(i)} aria-label={`${dict.zoom}: ${img.alt}`}>
              <Image
                src={img.src}
                alt={img.alt}
                width={960}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={img.src.endsWith(".svg")}
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={ref}
        className="lightbox"
        aria-label={image?.alt}
        onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
        onKeyDown={(e) => {
          if (!many) return;
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {image && (
          <figure className="dialog-frame">
            <Image
              src={image.src}
              alt={image.alt}
              width={1600}
              height={1000}
              sizes="90vw"
              unoptimized={image.src.endsWith(".svg")}
            />
            <figcaption>
              {many && (
                <button type="button" className="btn" onClick={() => step(-1)} aria-label={dict.prev}>
                  ←
                </button>
              )}
              <span>{image.alt}</span>
              {many && (
                <button type="button" className="btn" onClick={() => step(1)} aria-label={dict.next}>
                  →
                </button>
              )}
              <button type="button" className="btn" onClick={() => ref.current?.close()}>
                {closeLabel}
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
