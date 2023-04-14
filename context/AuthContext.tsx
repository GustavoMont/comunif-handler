import api from "@/config/api";
import { AuthCookie } from "@/models/Auth";
import { RoleEnum, User } from "@/models/User";
import { authCookieKey, getToken } from "@/utils/auth";
import jwtDecode from "jwt-decode";
import Router from "next/router";
import { destroyCookie, setCookie } from "nookies";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type loginType = (payload: {
  username: string;
  password: string;
}) => Promise<void>;

interface IAuthContext {
  login: loginType;
  user: User | null;
  logout(): void;
}

const AuthContext = createContext({} as IAuthContext);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const storeAccess = (token: string) => {
    setCookie(null, authCookieKey, token, {
      maxAge: 60 * 60 * 8,
    });
  };

  const getUser = async (id: number): Promise<User> => {
    const { data: user } = await api.get<User>(`/users/${id}`);
    return user;
  };

  const setUserByToken = useCallback(async (token: string) => {
    const { sub: id, roles } = decodeToken(token);
    if (!roles.includes(RoleEnum.admin)) {
      throw new Error("Voce não tem permissão para acessar essa plataforma");
    }
    storeAccess(token);
    setUser(await getUser(id));
  }, []);

  const decodeToken = (token: string) =>
    jwtDecode<{ sub: number; username: string; roles: RoleEnum[] }>(token);

  const login: loginType = async (data) => {
    const {
      data: { access },
    } = await api.post<AuthCookie>("/auth/login", data);
    await setUserByToken(access);
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUserByToken(token);
    }
  }, [setUserByToken]);

  useEffect(() => {
    let mounted = true;

    if (mounted && !!user) {
      Router.push("/");
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout() {
          destroyCookie(null, authCookieKey);
        },
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
