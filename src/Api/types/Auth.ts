export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  first_name: string;
  first_last_name: string;
  phone_number: number;
  number_identification: number;
  email: string;
  password: string;
  confirm_password: string;
}

export interface UserDto {
  Id: number;
  email: string;
  password?: string;
  role_id: number;
  person_id: number;
}
