export interface SysI18n {
  [key: string]: any;
  key: string;
  i18n: string;
  typeGroup: 'SERVER' | 'CLIENT';
  lang: Lang[];
}
export interface Lang {
  message: string;
  language: string;
}
