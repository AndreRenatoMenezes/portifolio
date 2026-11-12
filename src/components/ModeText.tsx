type Props = {
  direct: string;
  adventure: string;
};

/**
 * Renderiza os dois rótulos no mesmo HTML; `mode.css` esconde o inativo com
 * `display: none` conforme `html[data-mode]`, preservando o nome acessível único.
 */
export function ModeText({ direct, adventure }: Props) {
  return (
    <>
      <span data-mode-only="direct">{direct}</span>
      <span data-mode-only="adventure">{adventure}</span>
    </>
  );
}
