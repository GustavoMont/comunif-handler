import api from "@/config/api";
import { AuthCookie } from "@/models/Auth";
import { RoleEnum, User } from "@/models/User";
import { deleteTokens, getToken, storeTokens } from "@/utils/auth";
import jwtDecode from "jwt-decode";
import Router from "next/router";
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

  const getUser = async (id: number): Promise<User> => {
    try {
      const { data: user } = await api.get<User>(`/users/${id}`);
      return user;
    } catch (error) {
      deleteTokens();
      throw new Error("User does not exists");
    }
  };
  const logout = () => {
    deleteTokens();
    Router.push("/login");
  };

  const setUserByToken = useCallback(async (token: string) => {
    try {
      const { sub: id, roles } = decodeToken(token);
      if (!roles.includes(RoleEnum.admin)) {
        throw new Error("Voce não tem permissão para acessar essa plataforma");
      }
      setUser(await getUser(id));
    } catch (error) {
      Router.push("/login");
    }
  }, []);

  const decodeToken = (token: string) =>
    jwtDecode<{ sub: number; username: string; roles: RoleEnum[] }>(token);

  const login: loginType = async (data) => {
    const {
      data: { access, refreshToken },
    } = await api.post<AuthCookie>("/auth/login", data);
    storeTokens({ access, refreshToken });
    await setUserByToken(access);
    Router.push("/");
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      Router.push("/login");
    } else if (!user) {
      setUserByToken(token);
    }
  }, [setUserByToken, user]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
