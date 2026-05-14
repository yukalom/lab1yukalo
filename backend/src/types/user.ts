export type userDto = {
    id: number,
    name: string,
    login: string,
    password: string
};

export type userRow = {
    id: number,
    name: string,
    login: string,
    password: string
};

export type userUpdateDto = {
     id: number,
    name: string,
    login: string,
    password: string
};

export type ListItemsQuery = {
  limit?: number;
  offset?: number;
  q?: string | null;
  sortBy?: "name" | "login" | "password";
  sortDir?: "asc" | "desc";
};

export type listUser = {
    items : userDto[],
    page: {
    limit: number;
    offset: number;
    count: number;
  };   
}

export type userCreateDto = {
    name: string,
    login: string,
    password: string
};

