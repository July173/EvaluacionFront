export interface FormItemDto {
  Name: string;
  Path: string;
}

export interface MenuFormDto {
  Id: number;
  Name: string;
  Form: FormItemDto[];
}

export interface MenuDto {
  Rol: string;
  ModuleForm: MenuFormDto[];
}
