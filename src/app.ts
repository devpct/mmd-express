import express, { Application, Request, Response, NextFunction } from 'express';

class MohammadExpress {
  private app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public use(middleware: (req: Request, res: Response, next: NextFunction) => void) {
    this.app.use(middleware);
  }

  public get(path: string, handler: (req: Request, res: Response) => void) {
    this.app.get(path, handler);
  }

  public post(path: string, handler: (req: Request, res: Response) => void) {
    this.app.post(path, handler);
  }

  public put(path: string, handler: (req: Request, res: Response) => void) {
    this.app.put(path, handler);
  }

  public delete(path: string, handler: (req: Request, res: Response) => void) {
    this.app.delete(path, handler);
  }

  public listen(port: number, callback: () => void) {
    this.app.listen(port, callback);
  }
}

export default MohammadExpress;
