export const waLink=(num,lines)=>`https://wa.me/${num}?text=${encodeURIComponent(lines.join("\n"))}`;
