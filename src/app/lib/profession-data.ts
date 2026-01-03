export const professions: { value: string; label: string }[] = [
  { value: "plumbing", label: "Santexnik" },
  { value: "electrical", label: "Elektrik" },
  { value: "tiler", label: "Plitkachi / Bruschatkachi" },
  { value: "painter", label: "Bo‘yoqchi" },
  { value: "window_specialist", label: "Akfa romchi" },
  { value: "furniture", label: "Mebelchi" },
  { value: "stairs", label: "Stashkachi / Zinachi" },
  { value: "alkapon", label: "Alkaponchi" },
  { value: "prorab", label: "Prorab (brigada bilan)" },
  { value: "cleaning", label: "Tozalov xizmati" },
  { value: "other", label: "Boshqa" },
];

export const getProfessionLabel = (value: string): string => {
  const profession = professions.find((p) => p.value === value);
  return profession ? profession.label : value;
}
