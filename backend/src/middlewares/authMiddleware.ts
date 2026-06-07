import type { Request, Response, NextFunction} from "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: "student" | "admin";
            };
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization; // Очікуємо рядок типу "User: 1, Role: student"

    if (!authHeader) {
        return res.status(401).json({ error: "Неавторизований запит. Надайте заголовок Authorization" });
    }

    try {
        const [userId, role] = authHeader.split(",");
        
        if (!userId || !role) {
            return res.status(401).json({ error: "Невірний формат авторизації" });
        }

        req.user = {
            id: Number(userId),
            role: role.trim() as "student" | "admin"
        };

        next();
    } catch (err) {
        return res.status(401).json({ error: "Невірний формат авторизації" });
    }
}
export function requireRole(role: "student" | "admin") {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: `Доступ заборонено. Потрібна роль: ${role}` });
        }
        next();
    };
}

import { Request, Response, NextFunction } from "express";

// Розширюємо тип Request в Express, щоб додати туди дані користувача
declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["x-user-id"]; 

  if (!authHeader) {
    return res.status(401).json({ error: "Користувач не автентифікований." });
  }

  req.user = { id: Number(authHeader) };
  next();
}