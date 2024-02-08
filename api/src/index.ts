// You can also use CommonJS `require('@sentry/node')` instead of `import`
import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import * as Redis from "redis"
import * as os from "os";
import * as pg from "pg";
import axios from "axios";
import http from "http";
import { Stripe } from "stripe";

import { ConfigLoader } from "./utils/loaders/ConfigLoader";
import { RouteLoader } from "./utils/loaders/RouteLoader";
import { write_to_logs } from "./utils/cache/Logger";

const app = express();
export const config: any = ConfigLoader("config.yaml");

app.set("trust proxy");
app.use(cors(config.server.cors));
app.use(bodyparser.json())
app.use(express.json({limit: config.server.bandwidth_limit}));
app.use(express.urlencoded({limit: config.server.bandwidth_limit}));
app.use(bodyparser.urlencoded({ extended: config.server.url_encoded }));
RouteLoader(app);

app.listen(config.server.port, config.server.host, async () => {

    // Prettify the logging for the console
    write_to_logs(
        "connections",
        `Running on ${config.server.host}:${config.server.port} server.`
    )

});