import { NextApiRequest, NextPageContext } from "next";

export type ctxType =
  | Pick<NextPageContext, "req">
  | {
      req: NextApiRequest;
    }
  | {
      req: Request;
    };
