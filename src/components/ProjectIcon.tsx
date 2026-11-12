import Image from "next/image";
import { ItemIconSvg, type ItemIcon } from "@/components/icons/ItemIcons";

type Icon = { src: string; width: number; height: number } | undefined;

export function ProjectIcon({
  icon,
  item,
  size,
  className,
}: {
  icon: Icon;
  item: ItemIcon;
  size: number;
  className?: string;
}) {
  if (!icon) return <ItemIconSvg name={item} size={size} />;
  return (
    <Image
      className={className ?? "project-icon-real"}
      src={icon.src}
      width={size}
      height={size}
      alt=""
      unoptimized
    />
  );
}
