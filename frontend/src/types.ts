export type CreateSoftwareDto = {
    name: string,
    version: number,
    licenseType: "Free" | "Commercial" | "Academic",
    date: string
}

export type SoftwareProductDto = {
    id: number,
    name: string,
    version: number,
    licenseType: "Free" | "Commercial" | "Academic",
    date: string
}

export type UpdateSoftwareDto = {
    id: number,
    name: string,
    version: number,
    licenseType: "Free" | "Commercial" | "Academic",
    date: string
}


export type UserDto = {
    id: number,
    name: string,
    login: string,
    password: string
}

export type LicenseDto = {
    id: number,
    software_id: number,
    license_key: string
}

export type RequestDto = {
    id: number,
    software_id: number,
    user_id: number,
    request_date: string
}

