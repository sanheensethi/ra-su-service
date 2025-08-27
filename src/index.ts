import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from 'body-parser';
import { config } from "./config/v1/config";
import InviteController from "./controllers/v1/invite.controller";
import { routeHandler } from "./middleware/v1/routeHandler";
import ContractorSchemaController from "./controllers/v1/contractorSchema.controller";


const app = express();

app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


const inviteController = new InviteController();
const contractorSchemaController = new ContractorSchemaController();

app.use(routeHandler);

app.use('/su/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SU Service Service is running' });
});

app.use('/su/api/v1', inviteController.getRouter());
app.use('/su/api/v1', contractorSchemaController.getRouter());

app.listen(config.port, () => {
  console.log(`su service listening on :${config.port}`);
});
