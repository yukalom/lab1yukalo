export type SortDirection = "asc" | "desc";
export type ListItemsQuery = {
  limit?: number;
  offset?: number;
  q?: string | null;
  sortBy?: string;
  sortDir?: SortDirection;
};

type Page = {
  limit: number;
  offset: number;
  count: number;
};

export type softwareDto = {
  id: number;
  name: string;
  version: number;
  licensetype: "Free" | "Commercial" | "Academic";
  date: string;
};
export type softwareCreateDto = Omit<softwareDto, "id">;
export type softwareUpdateDto = softwareDto;
export type listSoftware = { items: softwareDto[]; page: Page };

export type licenseDto = {
  id: number;
  software_id: number;
  license_key: string;
};
export type licenseCreateDto = Omit<licenseDto, "id">;
export type licenseUpdateDto = licenseDto;
export type listLicense = { items: licenseDto[]; page: Page };

export type userDto = {
  id: number;
  name: string;
  login: string;
  password: string;
};
export type userCreateDto = Omit<userDto, "id">;
export type userUpdateDto = userDto;
export type listUser = { items: userDto[]; page: Page };

export type requestDto = {
  id: number;
  software_id: number;
  user_id: number;
  request_date: string;
};
export type requestCreateDto = Omit<requestDto, "id">;
export type requestUpdateDto = requestDto;
export type listRequest = { items: requestDto[]; page: Page };
