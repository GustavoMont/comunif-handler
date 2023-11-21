import { AxiosError } from "axios";

export class ApiErrorHandler {
  private _statusCode!: number;
  public message: string;
  private _title!: string;

  constructor(error: AxiosError | Error | unknown) {
    this.message = "Tente mais tarde ou contate o suporte";
    this.statusCode = 500;
    if (error instanceof AxiosError) {
      const { response } = error;
      this.statusCode = response?.status ?? 500;
      if (response && "message" in response.data) {
        const message: string | string[] = response.data.message;
        this.message =
          typeof message === "object" ? message.join(", ") : message;
      }
    }
  }

  private handleErrorTitle(statusCode: number) {
    const defaultMessage = "Oops 🚧! Ocorreu um erro inesperado";
    if (statusCode >= 500) {
      this._title = defaultMessage;
      return;
    }
    switch (statusCode) {
      case 400:
        this._title = "Oops 😅! Algumas informações inconsistentes";
        break;
      case 401:
        this._title = "Hmm 👀! Erro ao validar seu acesso";
        break;
      case 403:
        this._title = "Parado aí ✋! Você não pode realizar está ação";
        break;
      case 404:
        this._title =
          "Oops ❓! Verifique se passou as informações corretamente";
        break;
      default:
        this._title = defaultMessage;
        break;
    }
  }

  public get statusCode(): number {
    return this._statusCode;
  }

  public set statusCode(v: number) {
    this.handleErrorTitle(v);
    this._statusCode = v;
  }

  public get title(): string {
    return this._title;
  }
}
