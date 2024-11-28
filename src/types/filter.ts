interface FilterOptions {
  text: string;
  value: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface FilterConfig {
  [key: string]: {
    [filterKey: string]: {
      title: string;
      options: FilterOptions[];
    };
  };
}
