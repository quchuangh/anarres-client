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

export interface RoleVO {
  id: number;
  name: string;
  role: string;
  enabled: boolean;
  description: string;
}

export interface AbilityVO {
  id: number;
  parentId: number;
  name: string;
  ability: string;
  parents: string;
  licensable: boolean;
  abilityType: 'MENU' | 'FUNCTION' | 'FIELD';
  sortRank: number;
  description: string;
  enabled: boolean;

  disableOpt?: boolean; //是否禁用操作
  checked?: boolean; //是否已经选中
}

export interface RoleAbilities {
  roleId: number;
  abilities: Array<AbilityCheckInfo>;
}

export interface AbilityCheckInfo {
  abilityId: number;
  licensable: boolean;
  checked: boolean;
}

// export interface PermissionSource {
//   id: number,
//   name: string,
//   sort: number,
//   type: 'MENU'|'BUTTON',
//   value: string,
//   incoming?: Array<string>;
//   returns?: Array<string>;
//   fieldCohesiveList?:Array<any>;
// }
//
// export interface ResponsePermission {
//   leaf: boolean,
//   root: boolean,
//   source?:PermissionSource,
//   children: Array<ResponsePermission>;
// }
