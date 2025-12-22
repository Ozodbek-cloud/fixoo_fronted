

export const professions: { value: string; label: string }[] = [
  { value: "electrician", label: "Elektrik" },
  { value: "plumber", label: "Santexnik" },
  { value: "hydraulic_engineer", label: "Suvarshchik" },
  { value: "concrete_worker", label: "Beton quyuvchi" },
  { value: "drywall_specialist", label: "Gipskarton ustasi" },
  { value: "plasterer", label: "Suvagar (shpaklyovkachi)" },
  { value: "painter", label: "Bo'yoqchi (molyer)" },
  { value: "tiler", label: "Plitkachnik" },
  { value: "builder", label: "Quruvchi" },
  { value: "tile_plasterer", label: "Kafel-shpaklyovka ustasi" },
  { value: "flooring_specialist", label: "Yelimli pol ustasi" },
  { value: "siding_specialist", label: "Siding ustasi" },
  { value: "welder", label: "Darbaza va panjara ustasi" },
  { value: "carpenter", label: "Usta-stolyor" },
  { value: "parquet_specialist", label: "Yog'och ustasi (parketchi)" },
  { value: "ceiling_specialist", label: "Shift ustasi" },
  { value: "hvac_technician", label: "Konditsioner ustasi" },
  { value: "glass_specialist", label: "Shisha ustasi" },
  { value: "roofer", label: "Tom ustasi" },
  { value: "window_specialist", label: "Alyuminiy va plastik rom ustasi" },
];

export const getProfessionLabel = (value: string): string => {
  const profession = professions.find((p) => p.value === value);
  return profession ? profession.label : value;
}

