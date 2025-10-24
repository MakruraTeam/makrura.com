export interface MainDrawerNavigationLink {
  title: string;
  location: 'top' | 'bottom';
  to?: string;
  icon?: string;
  customIcon?: string;
  alt?: string;
  customFunction?: () => void;
}
