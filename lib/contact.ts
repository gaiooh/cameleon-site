// TROQUE pelos seus dados reais antes de publicar o site.
export const contact = {
  email: "contato@cameleon.com.br",
  whatsapp: "5500000000000", // DDI + DDD + número, só dígitos
  instagram: "cameleon",
};

export const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
  "Olá! Vim pelo site da Cameleon e quero falar sobre a identidade da minha empresa.",
)}`;
