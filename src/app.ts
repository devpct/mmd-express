import http from 'http';

type RequestHandler = (req: http.IncomingMessage, res: http.ServerResponse) => void;

class MohammadExpress {
  private routes: { [path: string]: RequestHandler } = {};

  public get(path: string, handler: RequestHandler) {
    this.routes[path] = handler;
  }

  public listen(port: number, callback: () => void) {
    const server = http.createServer((req, res) => {
      const routeHandler = this.routes[req.url];
      if (routeHandler) {
        routeHandler(req, res);
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    server.listen(port, callback);
  }
}

export default MohammadExpress;