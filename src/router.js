import Router from '@koa/router';
import {healthcheck} from "./api/healthcheck.js";
import {routeToFunction} from "./middlewares.js";
import {signUp, signIn} from "./controllers/user.js";

const router = new Router();

router.get('/healthcheck', routeToFunction(healthcheck));

router.post('/sign-up', routeToFunction(signUp));
router.post('/sign-in', routeToFunction(signIn));

export default router;