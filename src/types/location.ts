// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Provinces {
  id: string;
  name: string;
  type: string;
  typeText: string;
  slug: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Districts {
  id: string;
  name: string;
  provinceId: string;
  type: string;
  typeText: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Wards {
  id: string;
  name: string;
  districtId: string;
  type: string;
  typeText: string;
}
