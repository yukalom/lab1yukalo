let data = [];
const sortColumnMap = {
    id: "id",
    name: "name",
    login: "login",
    password: "password"
};
function mapRowToDto(row) {
    return {
        id: Number(row.id),
        name: String(row.name),
        login: String(row.login),
        password: String(row.password)
    };
}
export async function getById(id) {
    const row = data.find(item => item.id === id);
    if (!row) {
        return null;
    }
    return mapRowToDto(row);
}
export async function update(dto) {
    let row = data.find(item => item.id === dto.id);
    if (!row) {
        return null;
    }
    row.name = dto.name;
    row.login = dto.login;
    row.password = dto.password;
    return getById(dto.id);
}
export async function create(dto) {
    let last_old;
    if (data.length === 0) {
        last_old = 0;
    }
    else {
        last_old = Number(data.lastIndexOf);
    }
    data.push({ id: last_old + 1, name: dto.name, login: dto.login, password: dto.password });
    const created = await getById(Number(last_old) + 1);
    if (!created) {
        throw new Error("Created item could not be reloaded");
    }
    return created;
}
export async function remove(id) {
    data.splice(data.indexOf(data.find(item => item.id === id), 0), 1);
    return true;
}
export async function getAll(query) {
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
    const offset = Math.max(Number(query.offset ?? 0), 0);
    return {
        items: data.map(row => mapRowToDto(row)),
        page: {
            limit,
            offset,
            count: data.length,
        },
    };
}
//# sourceMappingURL=userRepositoryBE.js.map