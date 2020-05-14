import { bootstrap } from "platform-api";
import path from "path";

// path to configurations folder, relative to the repo root
const configFolder = "./config";
// path to the services folder, relative to the this file (should resolve to something like "<REPO>/[src | dist]/services")
const servicesFolder = path.resolve(__dirname, "./services");

bootstrap(configFolder, servicesFolder);
