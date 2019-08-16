import app from "./app";
import Config from "./services/config";

const PORT = Config.get("PORT", 3000);

const server = app.listen(PORT, () => {
  console.log(
    "App is running on http://localhost:%d in %s mode",
    PORT,
    Config.get("NODE_ENV", "dev")
  );
});

export default server;