// ⁘[ ENTRY POINT ]⁘

import app from "./app.js";
import { config } from "./config.js";

app.listen(config.port, () => {
  console.log(`brewscore server corriendo en puerto ${config.port}`);
});
